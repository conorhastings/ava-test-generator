'use strict';

const fs = require('fs');
const recast = require('recast');
const path = require('path');
const camel = require('camelcase');

function findReturnPath(body, args) {
  if (type === "IfStatement") {
    const testName = body.test.name;
    if (body.test.type === "Identifier" && args.indexOf(testName) !== -1) {

    }
  }
}

function generateImport(name, file, isDefault) {
  return `import ${isDefault ? name : `{${name}}`} from ${path.join(__dirname, file)}`;
}

function generateAvaTest(file) {
  fs.readFile(path.join(__dirname, file), 'utf8', (err, code) => {
    if (err) {
      process.exit(1);
    }
    let imports = [`import test from 'ava'`];
    let tests = [];
    const codeBody = recast.parse(code).program.body;
    codeBody.forEach(segment => {
      if (segment.type === 'ExportDefaultDeclaration' && segment.declaration.type === 'FunctionDeclaration') {
        let name;
        const args = segment.declaration.params.map(param => param.name);
        if (segment.declaration.id === null) {
          name = camel(file.split('.js')[0]);
        }
        else {
          name = segment.declaration.id.name;
        }
        if (segment.declaration.body.body.length) {
          segment.declaration.body.body.forEach(seg => {
            const returnTest = findReturnPath(seg, args);
          });
        }
        imports.push(generateImport(name, file, true));
//         tests.push(`test(/* TODO */, t => { 
//   t.same(${name}(/* TODO */)), /* TODO */);
// });`);
      }
    });
    console.log(tests.join('\n\n'));
  });
}

generateAvaTest('test.js');