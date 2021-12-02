const socket = require('socket.io');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const indexPath = path.join(__dirname, './index.html');
    const readStream = fs.createReadStream(indexPath);

    readStream.pipe(res);
});

const io = socket(server);

io.on('connection', client => {
    console.log(`client ${ client.id } connected`);

    client.broadcast.emit("partner_connected", client.id);

    client.on('client-msg', data => {
        // console.log(data);

        const payload = {
            message: data.message.split('').reverse().join(''),
            username: client.id.slice(0, 6)
        };

        client.broadcast.emit('partner_message', [client.id.slice(0,6), data.message])
        client.broadcast.emit('server-msg', payload);
        client.emit('server-msg', payload);
    })

    client.on("disconnecting", (reason) => {
            client.broadcast.emit("user has left", client.id);
      });
});

server.listen(5555);
