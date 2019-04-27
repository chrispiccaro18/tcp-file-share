const net = require('net');
const fs = require('fs');
const readline = require('readline');

const options = {
  encoding: 'utf8', 
  highWaterMark: 16 * 1024 
};
const readClone = fs.createReadStream('/Users/chrispiccaro/clone/hello.txt', options);
readClone.on('data', chunk => {
  console.log(chunk);
});

fs.readdir('/Users/chrispiccaro/clone', (err, files) => {
  if(err) {
    return console.log(`Error: ${err}`);
  }
  console.log(files);
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '$ '
});

const connectionToServer = net.createConnection(7890, () => {
  console.log('I am connected');

  const address = connectionToServer.address();
  const ip = address.address;

  fs.readdir('/Users/chrispiccaro/clone', (err, files) => {
    if(err) {
      return console.log(`Error: ${err}`);
    }
    const payload = { ip, files };
    connectionToServer.write(JSON.stringify(payload));
  });

  rl.prompt();
  rl.on('line', line => {
    connectionToServer.write(line);
    rl.prompt();
  });
});


connectionToServer.on('data', data => {
  console.log(`\n${data.toString()}`);
  rl.prompt();
});
