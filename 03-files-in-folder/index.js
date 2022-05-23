const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

const folderPath = path.join(__dirname, './secret-folder');
  

const readFolder = async path => {
  const fileObjects = await fsPromises.readdir(path, { withFileTypes: true });

  fileObjects.forEach(async file => {
    if(file.isFile()) {
      const fileSize = (await fsPromises.stat(`${path}/${file.name}`)).size / 1000;
      const [name, extension] = file.name.split('.');
          
      console.log(`${name} - ${extension} - ${fileSize}kb`);
    }
  });
};

readFolder(folderPath);