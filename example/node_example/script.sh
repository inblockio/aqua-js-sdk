# In your library directory
rm -rf dist
# npm run build  # or whatever your build script is

# In your example project directory
# npm uninstall your-library-name
# npm install ../path-to-your-library  # if using local path
npm unlink aqua-protocol
cd ../.. && npm run build  && npm link && cd example/node_example && npm link aqua-protocol  && npm run dev  
npm run dev