// Node.js File Paths - Getting information out of a path
const path = require('node:path');

const notes = '/Week01/practical1/notes.txt'

console.log(path.dirname(notes)); // /Week01/practical1
console.log(path.basename(notes)); // notes.txt
console.log(path.extname(notes)); // .txt

// Reading files with node.js
const fs = require('node:fs');

fs.readFile('../practical1/notes.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Text from file: ' + data);
});

// Writing files with Node.js
const content = 'Some content!';

fs.writeFile('../practical1/notes.txt', content, err => {
  if (err) {
    console.error(err);
  } else {
    // file written successfully
  }
});

// Output to the command line using Node.js - Color the output
const chalk = require('chalk');

console.log(chalk.blue('Hello world!'));