// Exercise the retained browser script under the rewrite's ES-module package.
const fs = require('node:fs');
const vm = require('node:vm');
const legacyModule = {exports:{}};
vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'scheduler.js'),'utf8'), {
  module:legacyModule, performance, structuredClone, console,
});
module.exports = legacyModule.exports;
