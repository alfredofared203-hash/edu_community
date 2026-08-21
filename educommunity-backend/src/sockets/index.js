const registerChatHandlers = require('./chat.handler');
const registerPresenceHandlers = require('./presence.handler');
const registerLeaderboardHandlers = require('./leaderboard.handler');


function registerHandlers(io, socket) {
    console.log(`مستخدم جديد اتصل: ${socket.user?.id}`);
    registerPresenceHandlers(io, socket);
    registerChatHandlers(io, socket);
    registerLeaderboardHandlers(io, socket);
}

module.exports = registerHandlers;