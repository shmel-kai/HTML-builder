const fs = require('fs');
const readline = require('node:readline');
const path = require('path');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });
const newFilePath = path.join(__dirname, './new.txt');
const fileWriteStream = fs.createWriteStream(newFilePath);

const inputAnswer = (question) => {
  rl.question(question, (answer) => {
    if(answer.includes('exit')){
      console.log('Thanks!');
      rl.close();
    } else {
      fileWriteStream.write(`${answer}\n`, () => inputAnswer(''));
    }
  });
};

rl.on('SIGINT', () => {
  console.log('Thanks!');
  rl.close();
});

inputAnswer('What do you think of Node.js?\n');




