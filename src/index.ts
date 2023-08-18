import { Server } from './server';

let app = new Server().app;
const server = require('http').Server(app);
let port = process.env.PORT;
server.listen(port, () => {
    console.log(`server is listening at port ${port}`);
});

