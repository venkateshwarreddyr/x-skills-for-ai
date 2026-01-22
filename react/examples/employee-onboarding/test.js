console.log('cwd:', process.cwd());

try {
  const hooks = require('../lib/src/hooks.js');
  console.log('relative hooks.js Success');
} catch (e) {
  console.log('relative hooks.js Error:', e.message);
}

try {
  const main = require('../lib/src/index.js');
  console.log('relative main.js Success');
} catch (e) {
  console.log('relative main.js Error:', e.message);
}