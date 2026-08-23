const { saveMessage } = require('../services/chat/chat.service');


const roomName = (room) => `chat_${room}`;

function canUseRoom(user, room) {
  const parts = String(room || '').split(':');
  if (parts[0] === 'group') return user.role !== 'student' || user.grade === parts[1];
  if (parts[0] === 'teacher') return user.role === 'teacher' ? String(user.id) === parts[1] : user.role === 'student' && user.grade === parts[2];
  return false;
}

function registerChatHandlers(io, socket) {

  socket.on('join_room', (room) => {
    if (!canUseRoom(socket.user, room)) return socket.emit('error', { error: 'لا يمكنك الانضمام لهذه الغرفة' });
    socket.join(roomName(room));
    socket.emit('joined', { room });
  });

  
  socket.on('send_message', async ({ room, content, kind = 'text' }) => {
    if (!room || !content?.trim()) {
      return socket.emit('error', { error: 'الغرفة والمحتوى مطلوبان' });
    }
    if (!canUseRoom(socket.user, room) || !socket.rooms.has(roomName(room))) {
      return socket.emit('error', { error: 'يجب الانضمام للغرفة أولاً' });
    }

    try {
      const message = await saveMessage({ sender: socket.user.id, grade: room, content: content.trim(), kind });
  
      io.to(roomName(grade)).emit('new_message', message.toJSON());
    } catch (e) {
      console.error('خطأ في حفظ الرسالة:', e.message);
      socket.emit('error', { error: 'حدث خطأ أثناء إرسال الرسالة' });
    }
  });

}

module.exports = registerChatHandlers;
