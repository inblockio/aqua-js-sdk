# In your library directory
rm -rf dist &&  \
rm node_modules/ package-lock.json -rfv && \
npm i && npm run build 