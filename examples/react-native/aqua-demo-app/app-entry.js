// Import our custom EventEmitter polyfill first before anything else
import EventEmitter from './polyfills/events-polyfill';

// Set up global EventEmitter
global.EventEmitter = EventEmitter;

// Make sure Node.js 'events' module is available
global.events = { EventEmitter };

// Import other polyfills
import 'react-native-gesture-handler';
import './polyfills/stream-polyfill';
import './polyfills/net-polyfill';
import './polyfills/tls-polyfill';
import './polyfills/ws-polyfill';

// Set up global Buffer
import { Buffer } from 'buffer';
global.Buffer = Buffer;

// Set up global process
global.process = global.process || {};
global.process.env = global.process.env || {};
global.process.browser = true;

// Import the actual app entry point
import 'expo-router/entry';
