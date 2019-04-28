const net = require('net');
const fs = require('fs');
const readline = require('readline');
// const parseMessage = require('./parse-message');

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
    const payload = { code: 1, ip, files };
    connectionToServer.write(JSON.stringify(payload));
  });

  rl.prompt();
  rl.on('line', line => {
    connectionToServer.write(JSON.stringify({ code: 2, line }));
    rl.prompt();
  });
});


connectionToServer.on('data', chunk => {
  const parsed = JSON.parse(chunk.toString());
  // const parsed = parseMessage(chunk.toString());
  console.log(parsed);
  if(parsed.code === 3) {
    setTimeout(() => {
      const downloadClient = net.createConnection(8080, () => {
        console.log('I am connected to 8080');
        const copy = fs.createWriteStream(`/Users/chrispiccaro/clone2/${parsed.file}`);
        downloadClient.on('data', chunk => {
          copy.write(chunk, err => {
            if(err) console.log(err);
          });
        });
      });
    }, 2000);
  }
  rl.prompt();
});
