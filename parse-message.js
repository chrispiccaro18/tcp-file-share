const db = require('./db');
const chatRoom = require('./chat-room');

function parseMessage(string, client) {
  const message = JSON.parse(string);

  switch(message.code) {
    case 1: {
      const { ip, files } = message;
      const newFiles = { ip, files };
      db.push({ nick: client.username, ...newFiles });
      chatRoom.clients.forEach(client => {
        client.write(JSON.stringify(db));
      });
      return newFiles;
    }
    case 2:
      for(let i = 0; i < db.length; i++) {
        for(let j = 0; j < db[i].files.length; j++)
          if(message.line === db[i].files[j]) {
            return { exists: true, nick: db[i].nick, ip: db[i].ip, file: message.line };
          }
      }
      return 'bad';
    case 3:
      console.log('i want to download');
      break;
    case 4:
      console.log('start listening');

      break;
    default:
      break;
  }
}

module.exports = parseMessage;
