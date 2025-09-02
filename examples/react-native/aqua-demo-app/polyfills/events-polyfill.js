/**
 * Events polyfill for React Native
 * This provides a minimal implementation of Node.js events module
 */

// Simple EventEmitter implementation
class EventEmitter {
  constructor() {
    this._events = {};
    this._maxListeners = 10;
  }

  setMaxListeners(n) {
    this._maxListeners = n;
    return this;
  }

  getMaxListeners() {
    return this._maxListeners;
  }

  emit(type, ...args) {
    if (!this._events[type]) return false;
    
    const handlers = this._events[type];
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].apply(this, args);
    }
    
    return true;
  }

  addListener(type, listener) {
    return this.on(type, listener);
  }

  on(type, listener) {
    if (!this._events[type]) {
      this._events[type] = [];
    }
    
    this._events[type].push(listener);
    
    return this;
  }

  once(type, listener) {
    const onceWrapper = (...args) => {
      listener.apply(this, args);
      this.removeListener(type, onceWrapper);
    };
    
    return this.on(type, onceWrapper);
  }

  removeListener(type, listener) {
    if (!this._events[type]) return this;
    
    const list = this._events[type];
    const index = list.indexOf(listener);
    
    if (index !== -1) {
      list.splice(index, 1);
    }
    
    return this;
  }

  off(type, listener) {
    return this.removeListener(type, listener);
  }

  removeAllListeners(type) {
    if (type) {
      delete this._events[type];
    } else {
      this._events = {};
    }
    
    return this;
  }

  listeners(type) {
    return this._events[type] ? [...this._events[type]] : [];
  }

  rawListeners(type) {
    return this.listeners(type);
  }

  eventNames() {
    return Object.keys(this._events);
  }
}

// Create a static method
EventEmitter.defaultMaxListeners = 10;
EventEmitter.once = function(emitter, name, options) {
  return new Promise((resolve, reject) => {
    const eventListener = (...args) => {
      resolve(args);
    };
    emitter.once(name, eventListener);
  });
};

// Export the EventEmitter
export default EventEmitter;

// For CommonJS compatibility
module.exports = EventEmitter;
