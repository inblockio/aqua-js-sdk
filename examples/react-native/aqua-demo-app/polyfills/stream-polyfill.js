/**
 * Stream polyfill for React Native
 * This provides a minimal implementation to prevent errors with the stream module
 */

// Create a minimal stream implementation that doesn't depend on stream-browserify
// This avoids the circular dependency with events
class Readable {
  constructor(options) {
    this.options = options || {};
    this._readableState = { flowing: null };
  }
  
  pipe(dest) { return dest; }
  on() { return this; }
  once() { return this; }
  off() { return this; }
  removeListener() { return this; }
  resume() { return this; }
  pause() { return this; }
  unpipe() { return this; }
  push() { return true; }
}

class Writable {
  constructor(options) {
    this.options = options || {};
  }
  
  on() { return this; }
  once() { return this; }
  off() { return this; }
  write() { return true; }
  end() { return this; }
}

class Transform extends Readable {
  constructor(options) {
    super(options);
  }
  
  write() { return true; }
  end() { return this; }
}

class Duplex extends Readable {
  constructor(options) {
    super(options);
  }
  
  write() { return true; }
  end() { return this; }
}

// Export our stream components
export default {
  Readable,
  Writable,
  Transform,
  Duplex
};

// For CommonJS compatibility
module.exports = {
  Readable,
  Writable,
  Transform,
  Duplex
};
