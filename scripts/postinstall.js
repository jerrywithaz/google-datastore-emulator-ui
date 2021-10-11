const { exec } = require('child_process');

console.log(process.cwd());

console.log('Installing server packages');

exec('cd ./src/server && npm install', (err, stdout, stderr) => {
    if (err) {
        console.error(err);
    }
    else {
        console.log(stdout);
        console.log(stderr);
    }
});