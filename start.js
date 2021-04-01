const micro = require('micro');
const index = require('./api/webhook');

const server = micro(index);
server.listen(80);