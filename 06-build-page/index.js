const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

const distPath = path.join(__dirname, './project-dist');
const projectPath = path.join(__dirname, './');

const copyDir = async (src, dist) => {
  await fsPromises.mkdir(dist, { recursive: true });
  const srcDirFiles = await fsPromises.readdir(src, { withFileTypes: true });
  
  srcDirFiles.forEach(async file => {
    if (file.isFile()) {
      await fsPromises.copyFile(`${src}/${file.name}`, `${dist}/${file.name}`);
    } else {
      await copyDir(`${src}/${file.name}`, `${dist}/${file.name}`);
    }
  });
};

const mergeFiles = async (src, dist) => {
  await fsPromises.appendFile(dist, '');
  const files = await fsPromises.readdir(src, { withFileTypes: true });
  const writeableStream = fs.createWriteStream(dist, 'utf-8');
  
  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const fileReadStream = fs.createReadStream(`${src}/${file.name}`, 'utf-8');
      fileReadStream.pipe(writeableStream);
    }
  }
};

const bundleProject = async (src, dist) => {
  await fsPromises.rm(dist, { recursive: true, force: true });
  await fsPromises.mkdir(dist, { recursive: true });
  const entities = await fsPromises.readdir(src, { withFileTypes: true });

  entities.forEach(async entity => {
    if (entity.isDirectory() && entity.name === 'assets') {
      await copyDir(`${src}/${entity.name}`, `${dist}/${entity.name}`);
    }

    if (entity.isDirectory() && entity.name === 'styles') {
      await mergeFiles(`${src}/${entity.name}`, `${dist}/style.css`);
    }

    if (entity.isFile() && entity.name === 'template.html') {
      let mainHtmlContent = await fsPromises.readFile(`${src}/template.html`, 'utf-8');
      const componentsDirFiles = await fsPromises.readdir(`${src}/components`, { withFileTypes: true });
      
      await Promise.all(
        componentsDirFiles.map(async file => {
          const componentContent = await fsPromises.readFile(`${src}/components/${file.name}`, 'utf-8');
          mainHtmlContent = mainHtmlContent.replace(`{{${file.name.split('.')[0]}}}`, componentContent);
        })
      );
      await fsPromises.appendFile(`${dist}/index.html`, mainHtmlContent);
    }
  });
};

bundleProject(projectPath, distPath);