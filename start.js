import micro from 'micro';
import index from './api/webhook';

const server = micro(index);
server.listen(4400);