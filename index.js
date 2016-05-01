'use strict';

const fs = require('fs');
const recast = require('recast');
const path = require('path');
const camel = require('camelcase');

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
        if (segment.declaration.id === null) {
          name = camel(file.split('.js')[0]);
        }
        else {
          name = segment.declaration.id.name;
        }
        if (segment.declaration.body.body.length) {
          segment.declaration.body.body.forEach(seg => {
            console.log(seg);
          });
        }
        tests.push(`import ${name} from ${path.join(__dirname, file)}`)
        tests.push(`test(/* TODO */, t => { 
  t.same(${name}(/* TODO */)), /* TODO */);
});`);
      }
    });
    // console.log(tests.join('\n\n'));
  });
}

generateAvaTest('test.js');