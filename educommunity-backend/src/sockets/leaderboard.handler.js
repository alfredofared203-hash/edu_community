function registerLeaderboardHandlers(io, socket) {
  socket.on('join_leaderboard', (grade) => {
    const room = grade ? `leaderboard_${grade}` : 'leaderboard_global';
    socket.join(room);
    socket.emit('joined_leaderboard', { room });
  });

  socket.on('leave_leaderboard', (grade) => {
    const room = grade ? `leaderboard_${grade}` : 'leaderboard_global';
    socket.leave(room);
  });
}

module.exports = registerLeaderboardHandlers;
