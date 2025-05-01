Vue.createApp({
    data: function () {
      return {
        socket: null,
        playerId: null,
        boardState: [],
        players: {},
        items: [], 
        showModal: false,
        winningPlayer: null,
      };
    },
  
    methods: {
        handleItemClick: function (itemId) {
            var message = {
                action: "find",
                playerId: this.playerId,
                item: itemId,
            };
            this.sendMessage(message);
        },
  
        receiveMessage: function (data) {
            if (data.action === "updatePlayers") {
                this.players = data.players;
            } else if (data.action === 'updateItems') {
                this.items = data.items;
                if (this.items.length === 0) {
                    this.endGame();
                }
            }
        },

        endGame: function () {
            let maxFoundItems = 0;
            let winningPlayerId = null;

            for (let playerId in this.players) {
                if (this.players[playerId].foundItemsCount > maxFoundItems) {
                    maxFoundItems = this.players[playerId].foundItemsCount;
                    winningPlayerId = playerId;
                }
            }

            this.winningPlayer = Number(winningPlayerId)+1;
            this.showModal = true;
        },

        resetGame: function () {
            this.socket.send(JSON.stringify({ action: 'resetGame' }));
            this.showModal = false; 
            this.winningPlayer = null;
        },

        sendMessage: function (data) {
            this.socket.send(JSON.stringify(data));
        }
    },

    created: function () {
        this.socket = new WebSocket('wss://s24-websocket-jmeach45.onrender.com');
        console.log('WebSocket connection established.');

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.playerId) {
                this.playerId = data.playerId;
            } else {
                this.receiveMessage(data);
            }
        };
    }
}).mount('#app');