# I Spy Game

[https://s24-websocket-jmeach45.onrender.com/](https://s24-websocket-jmeach45.onrender.com/)

This project is a multiplayer online "I Spy" game built with **Vue.js** for the frontend and **Node.js with WebSocket** for the backend. Players join a shared game board that displays an image filled with hidden objects. Each player is assigned a unique ID and competes to find and click the hidden items. When a player correctly identifies an item, it is removed from the board and recorded under their score. The player list and item states are updated in real time across all clients using WebSocket communication. Once all items are found, a modal appears declaring the winner—the player who found the most items—and offers an option to reset the game.

The backend consists of a simple Node.js server that handles static file serving and real-time communication via WebSockets. It manages player assignments (supporting up to 4 players), tracks which items have been found by each player, and handles game state resets. The frontend takes advantage of Vue’s reactive components to visually represent the current players, items found, and overall game progress. This project provides a lightweight and interactive real-time multiplayer experience, ideal for web-based games and educational tools.
