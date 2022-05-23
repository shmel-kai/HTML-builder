const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, './text.txt');
const fileStream = fs.createReadStream(filePath);

const printStreamData = (stream, callback) => {
  const chunks = [];

  stream.on('data', (chunk) => {
    chunks.push(chunk.toString());
  });

  stream.on('end', () => {
    callback(chunks.join(''));
  });
};

printStreamData(fileStream, (data) => {
  console.log(data);
});