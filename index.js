'use strict';

const fs = require('fs');
const recast = require('recast');
const path = require('path');

function findReturnPath(body) {
  
}

function generateAvaTest(file) {
  fs.readFile(path.join(__dirname, file), 'utf8', (err, code) => {
    if (err) {
      process.exit(1);
    }
    let tests = [`import test from 'ava'`];
    const codeBody = recast.parse(code).program.body;
    codeBody.forEach(segment => {
      if (segment.type === 'ExportDefaultDeclaration' && segment.declaration.type === 'FunctionDeclaration') {
        let name;
        const params = segment.declaration.params.map(param => param.name);
        console.log(segment.declaration.body.body, params);
        if (segment.declaration.id === null) {
          name = file.split('.js')[0].replace('-', '');
        }
        else {
          name = segment.declaration.id.name;
        }
      }
    });
  });
}

generateAvaTest('test.js');