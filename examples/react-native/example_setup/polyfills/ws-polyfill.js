/**
 * WebSocket polyfill for React Native
 * This provides a minimal implementation to prevent errors with the ws module
 */

// Use React Native's built-in WebSocket implementation
const WebSocket = global.WebSocket;

// Create a minimal WebSocket Server implementation that does nothing
class WebSocketServer {
  constructor() {
    console.warn('WebSocketServer is not supported in React Native');
  }
  
  on() {
    return this;
  }
  
  close() {
    return this;
  }
}

module.exports = {
  WebSocket,
  WebSocketServer
};
