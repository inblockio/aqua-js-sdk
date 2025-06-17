/**
 * TLS module polyfill for React Native
 * This provides a minimal implementation to prevent errors with the tls module
 */

class TLSSocket {
  constructor() {
    console.warn('TLS operations are not supported in React Native');
    this.authorized = false;
    this.encrypted = false;
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

function connect() {
  console.warn('TLS connections are not supported in React Native');
  return new TLSSocket();
}

module.exports = {
  TLSSocket,
  connect,
  createServer: () => {
    console.warn('TLS servers are not supported in React Native');
    return {
      listen: () => {},
      on: () => {},
      close: () => {}
    };
  }
};
