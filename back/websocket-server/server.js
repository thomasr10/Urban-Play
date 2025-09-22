const WebSocket = require('ws'); //import du module ws
const server = new WebSocket.Server({ port: 8081 }); // création d'une instance de serveur WS sur le port 8081

server.on('connection', (ws) => { // écoute l'evt connection déclenché à chaque nouvelle connexion
    console.log('Client connecté');

    ws.on('message', (message) => { // écoute l'evt message déclenché à chaque nv message
        const data = JSON.parse(message); // transforme la chaine JSON en objet js
        console.log('Message reçu :', data);

        if (data.type === 'message') { // si type message
            server.clients.forEach(client => { // parcourt tous les clients connectés
                if (client.readyState === WebSocket.OPEN) { // si le client est en état OPEN on envoie le message
                    client.send(JSON.stringify(data));
                }
            });
        }
    });

    ws.on('close', () => { // on écoute l'évènement close 
        console.log('Client déconnecté');
    });
});

console.log('WebSocket en écoute sur ws://localhost:8081');
