const rug = require('random-username-generator');

class ChatRoom {
  constructor() {
    this.clients = new Map();
  }

  add(client) {
    const username = rug.generate();
    client.username = username;
    this.clients.set(username, client);
    return client;
  }

  getClient(username) {
    return this.clients.get(username);
  }

  rename(oldUsername, newUsername) {
    if(this.clients.get(newUsername)) return false;
    const client = this.clients.get(oldUsername);
    client.username = newUsername;
    this.clients.set(newUsername, client);
    return this.clients.delete(oldUsername);
  }

  all() {
    return [...this.clients.values()];
  }

  delete(username) {
    return this.clients.delete(username);
  }
}

module.exports = ChatRoom;
