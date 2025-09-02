/**
 * Net module polyfill for React Native
 * This provides a minimal implementation to prevent errors with the net module
 */

class Socket {
  constructor() {
    console.warn('Socket operations are not supported in React Native');
    this.destroyed = true;
  }
  
  on() {
    return this;
  }
  
  connect() {
    return this;
  }
  
  end() {
    return this;
  }
  
  destroy() {
    return this;
  }
}

class Server {
  constructor() {
    console.warn('Server operations are not supported in React Native');
  }
  
  listen() {
    return this;
  }
  
  on() {
    return this;
  }
  
  close() {
    return this;
  }
}

function createServer() {
  console.warn('Creating servers is not supported in React Native');
  return new Server();
}

function connect() {
  console.warn('Socket connections are not supported in React Native');
  return new Socket();
}

module.exports = {
  Socket,
  Server,
  createServer,
  connect,
  createConnection: connect
};
