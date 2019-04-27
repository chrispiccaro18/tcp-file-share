const net = require('net');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '$ '
});

const connectionToServer = net.createConnection(7890, () => {
  console.log('I am connected');

  const address = connectionToServer.address();
  const ip = address.address;

  fs.readdir('/Users/chrispiccaro/clone2', (err, files) => {
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
  console.log(JSON.parse(data.toString()));
  rl.prompt();
});
