const net = require('net');
const fs = require('fs');
const readline = require('readline');
// const parseMessage = require('./parse-message');

const PORT = 8080;

const options = {
  encoding: 'utf8', 
  highWaterMark: 16 * 1024 
};

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


connectionToServer.on('data', chunk => {
  const parsed = JSON.parse(chunk.toString());
  // const parsed = parseMessage(chunk.toString());
  console.log(parsed);
  if(parsed.code === 4) {
    const server = net.createServer(client => {
      console.log('client connected');
      const read = fs.createReadStream(`/Users/chrispiccaro/clone/${parsed.file}`, options);
      read.on('data', chunk => {
        client.write(chunk);
      });
      read.on('close', () => {
        console.log('finished');
      });
    });
    server.listen(PORT, () => {
      console.log('listening on 8080');
    });
  }
  rl.prompt();
});
