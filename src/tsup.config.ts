import { defineConfig } from 'tsup';

export default defineConfig({
    format: ['cjs', 'esm'], // Generate both CommonJS and ES Modules
    entry: ['./src/index.ts'], // Entry point(s)
    dts: true, // Generate TypeScript declaration files
    shims: true, // Inject shims for Node.js globals
    skipNodeModulesBundle: true, // Don't bundle node_modules to avoid dynamic require issues
    clean: true, // Clean the output directory before building
    external: [
        'ethers', 
        'node-forge', 
        'asn1js', 
        'pkijs',
        'did-resolver',
        'dids',
        'key-did-provider-ed25519',
        'key-did-resolver',
        'nostr-tools',
        'openid-client',
        'ws'
    ], // Keep problematic packages as external
    esbuildOptions(options) {
        // Configure esbuild for Node.js
        options.define = {
            ...options.define,
            'process.env.NODE_ENV': '"production"'
        };
        options.platform = 'node';
        options.mainFields = ['module', 'main'];
        options.conditions = ['import', 'module', 'default'];
    }
});
