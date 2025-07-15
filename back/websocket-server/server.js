const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (ws) => {
    console.log('Client connecté');

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log('Message reçu :', data);

        if (data.type === 'message') {
            server.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        }
    });

    ws.on('close', () => {
        console.log('Client déconnecté');
    });
});

console.log('WebSocket en écoute sur ws://localhost:8080');
