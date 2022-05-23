const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

const destPath = path.join(__dirname, './files-copy');
const srcPath = path.join(__dirname, './files');

const copyDir = async (src, dest) => {
  await fsPromises.rm(dest, { recursive: true, force: true });
  await fsPromises.mkdir(dest, { recursive: true });
  const srcDirFiles = await fsPromises.readdir(src, { withFileTypes: true });

  srcDirFiles.forEach(async file => {
    if (file.isFile()) {
      await fsPromises.copyFile(`${src}/${file.name}`, `${dest}/${file.name}`);
    }
  });
};

copyDir(srcPath, destPath);