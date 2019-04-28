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

  fs.readdir('/Users/chrispiccaro/clone', (err, files) => {
    if(err) {
      return console.log(`Error: ${err}`);
    }
    const payload = { code: 1, ip, files };
    connectionToServer.write(JSON.stringify(payload));
  });

  rl.prompt();
  rl.on('line', line => {
    connectionToServer.write(JSON.stringify({ code: 2, line }));
    rl.prompt();
  });
});


connectionToServer.on('data', data => {
  console.log(JSON.parse(data.toString()));
  rl.prompt();
});
