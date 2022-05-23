const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

const destPath = path.join(__dirname, './project-dist/bundle.css');
const srcPath = path.join(__dirname, './styles');

const mergeFiles = async (src, dest) => {
  await fsPromises.appendFile(dest, '');
  const files = await fsPromises.readdir(src, { withFileTypes: true });
  const writeableStream = fs.createWriteStream(dest, 'utf-8');

  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const fileReadStream = fs.createReadStream(`${src}/${file.name}`, 'utf-8');
      fileReadStream.pipe(writeableStream);
    }
  }
};

mergeFiles(srcPath, destPath);