const WebSocket = require('ws');
const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.static('public'));

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

const wss = new WebSocket.Server({ server: server });

let players = {};
let items = [
    { id: 'key', name: 'Key', found: false, top: 60, left: 30, width: 20, height: 60 },
    { id: 'duck', name: 'Duck', found: false, top: 306, left: 168, width: 50, height: 42 },
    { id: 'teacup', name: 'Teacup', found: false, top: 296, left: 242, width: 40, height: 40 },
    { id: 'mouse', name: 'Mouse', found: false, top: 365, left: 450, width: 40, height: 25 },
    { id: 'banana', name: 'Banana', found: false, top: 455, left: 280, width: 70, height: 25 },
    { id: 'camera', name: 'Camera', found: false, top: 250, left: 415, width: 60, height: 40 },
    { id: 'clock', name: 'Clock', found: false, top: 270, left: 190, width: 50, height: 35 },
    { id: 'paddle', name: 'Ping Pong Paddle', found: false, top: 195, left: 100, width: 105, height: 20 },
    { id: 'phone', name: 'Phone', found: false, top: 245, left: 500, width: 25, height: 50 },
    { id: 'belt', name: 'Belt', found: false, top: 462, left: 420, width: 120, height: 28 },
    { id: 'watch', name: 'Watch', found: false, top: 394, left: 288, width: 48, height: 30 },
    { id: 'pompoms', name: 'Pompoms', found: false, top: 105, left: 373, width: 50, height: 13 },
    { id: 'lion', name: 'Lion', found: false, top: 140, left: 325, width: 25, height: 20 },
    { id: 'basketball', name: 'Basketball', found: false, top: 142, left: 267, width: 19, height: 17 },
    { id: 'shell', name: 'Shell', found: false, top: 175, left: 195, width: 39, height: 25 },
    { id: 'harmonica', name: 'Harmonica', found: false, top: 50, left: 130, width: 73, height: 15 },
    { id: 'coinstack', name: 'Coin Stack', found: false, top: 373, left: 380, width: 18, height: 23 },
    { id: 'dice', name: 'Dice', found: false, top: 314, left: 358, width: 25, height: 22 },
    { id: 'tack', name: 'Tack', found: false, top: 116, left: 630, width: 16, height: 18 },
    { id: 'feather', name: 'Feather', found: false, top: 140, left: 530, width: 70, height: 40 }
];
let playerCount = 0;

wss.on('connection', function connection(ws) {
    if (playerCount >= 4) {
        ws.close(1000, 'Too many players');
        return;
    }
    playerCount++;

    const playerId = playerCount;

    ws.send(JSON.stringify({ playerId }));
    ws.send(JSON.stringify({ action: 'updateItems', items: items }));

    players[playerId] = { foundItems: [] };

    sendPlayersListToAllClients();

    ws.on('message', function incoming(data) {
        const message = JSON.parse(data);
        if (message.action === 'find') {
            const itemIndex = items.findIndex(item => item.id === message.item);
            if (itemIndex !== -1) {
                items.splice(itemIndex, 1);
                players[playerId].foundItems.push(message.item);
                sendItemsToAllClients(); 
                sendPlayersListToAllClients(); 
            }
        } else if (message.action === 'resetGame') {

            items = [
                { id: 'key', name: 'Key', found: false, top: 60, left: 30, width: 20, height: 60 },
                { id: 'duck', name: 'Duck', found: false, top: 306, left: 168, width: 50, height: 42 },
                { id: 'teacup', name: 'Teacup', found: false, top: 296, left: 242, width: 40, height: 40 },
                { id: 'mouse', name: 'Mouse', found: false, top: 365, left: 450, width: 40, height: 25 },
                { id: 'banana', name: 'Banana', found: false, top: 455, left: 280, width: 70, height: 25 },
                { id: 'camera', name: 'Camera', found: false, top: 250, left: 415, width: 60, height: 40 },
                { id: 'clock', name: 'Clock', found: false, top: 270, left: 190, width: 50, height: 35 },
                { id: 'paddle', name: 'Ping Pong Paddle', found: false, top: 195, left: 100, width: 105, height: 20 },
                { id: 'phone', name: 'Phone', found: false, top: 245, left: 500, width: 25, height: 50 },
                { id: 'belt', name: 'Belt', found: false, top: 462, left: 420, width: 120, height: 28 },
                { id: 'watch', name: 'Watch', found: false, top: 394, left: 288, width: 48, height: 30 },
                { id: 'pompoms', name: 'Pompoms', found: false, top: 105, left: 373, width: 50, height: 13 },
                { id: 'lion', name: 'Lion', found: false, top: 140, left: 325, width: 25, height: 20 },
                { id: 'basketball', name: 'Basketball', found: false, top: 142, left: 267, width: 19, height: 17 },
                { id: 'shell', name: 'Shell', found: false, top: 175, left: 195, width: 39, height: 25 },
                { id: 'harmonica', name: 'Harmonica', found: false, top: 50, left: 130, width: 73, height: 15 },
                { id: 'coinstack', name: 'Coin Stack', found: false, top: 373, left: 380, width: 18, height: 23 },
                { id: 'dice', name: 'Dice', found: false, top: 314, left: 358, width: 25, height: 22 },
                { id: 'tack', name: 'Tack', found: false, top: 116, left: 630, width: 16, height: 18 },
                { id: 'feather', name: 'Feather', found: false, top: 140, left: 530, width: 70, height: 40 }
            ];

            for (const playerId in players) {
                players[playerId].foundItems = [];
            }

            sendItemsToAllClients();
            sendPlayersListToAllClients();
        }
    });

    ws.on('close', function close() {
        delete players[playerId];
        playerCount--;

        sendPlayersListToAllClients();
    });

    function sendPlayersListToAllClients() {
        const playersList = Object.keys(players).map(playerId => ({
            playerId,
            foundItemsCount: players[playerId].foundItems.length, // Include foundItemsCount
        }));
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ action: 'updatePlayers', players: playersList }));
            }
        });
    }
});

function sendItemsToAllClients() {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ action: 'updateItems', items: items }));
        }
    });
}

wss.on('listening', () => {
    console.log('WebSocket server is listening on port 8080');
    sendItemsToAllClients(); 
});
