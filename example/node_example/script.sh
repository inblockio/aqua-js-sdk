# In your library directory
rm -rf dist &&  \
npm unlink aqua-protocol && \
cd ../.. && npm run build  && \ 
npm link && cd example/node_example && \
npm link aqua-protocol  && npm run dev