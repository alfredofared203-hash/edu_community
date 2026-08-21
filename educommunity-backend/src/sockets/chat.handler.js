const { saveMessage, saveDM } = require('../services/chat/chat.service');
const { createNotification } = require('../services/notification/notification.service');
const { validateRoomMessage, validateDM } = require('../validators/chat');


const roomName = (grade) => `grade_${grade}`;

const userRoom = (userId) => `user_${userId}`;

function registerChatHandlers(io, socket) {

  socket.on('join_room', (grade) => {
    const { role, grade: userGrade } = socket.user;

    if (role === 'student' && userGrade !== grade) {
      return socket.emit('error', { error: 'لا يمكنك الانضمام لغرفة صف آخر' });
    }

    socket.join(roomName(grade));
    socket.emit('joined', { grade });
  });

  
  socket.on('send_message', async ({ grade, content }) => {
    const err = validateRoomMessage({ grade, content });
    if (err) return socket.emit('error', { error: err });

    if (!socket.rooms.has(roomName(grade))) {
      return socket.emit('error', { error: 'يجب الانضمام للغرفة أولاً' });
    }

    try {
      const message = await saveMessage({ sender: socket.user.id, grade, content: content.trim() });
      io.to(roomName(grade)).emit('new_message', message.toJSON());
    } catch (e) {
      console.error('خطأ في حفظ الرسالة:', e.message);
      socket.emit('error', { error: 'حدث خطأ أثناء إرسال الرسالة' });
    }
  });


  socket.on('send_dm', async ({ recipientId, content }) => {
    const err = validateDM({ recipientId, content });
    if (err) return socket.emit('error', { error: err });


    if (socket.user.id === recipientId) {
      return socket.emit('error', { error: 'لا يمكنك مراسلة نفسك' });
    }

    try {
      const message = await saveDM({ sender: socket.user.id, recipientId, content: content.trim() });
      if (!message) return socket.emit('error', { error: 'المستلم غير موجود' });

      const payload = message.toJSON();

     
      socket.emit('new_dm', payload);
      io.to(userRoom(recipientId)).emit('new_dm', payload);

      const notification = await createNotification({
        recipient: recipientId,
        type: 'new_dm',
        content: `رسالة جديدة من ${socket.user.name}`,
        relatedId: message.id,
      });
      io.to(userRoom(recipientId)).emit('new_notification', notification.toJSON());
    } catch (e) {
      console.error('خطأ في إرسال الرسالة المباشرة:', e.message);
      socket.emit('error', { error: 'حدث خطأ أثناء إرسال الرسالة' });
    }
  });

 
  socket.on('typing_start', ({ grade }) => {
    if (!grade || !socket.rooms.has(roomName(grade))) return;
    socket.to(roomName(grade)).emit('typing_start', { userId: socket.user.id, name: socket.user.name, grade });
  });

  socket.on('typing_stop', ({ grade }) => {
    if (!grade || !socket.rooms.has(roomName(grade))) return;
    socket.to(roomName(grade)).emit('typing_stop', { userId: socket.user.id, grade });
  });

 
  socket.on('dm_typing_start', ({ recipientId }) => {
    if (!recipientId) return;
    io.to(userRoom(recipientId)).emit('dm_typing_start', { userId: socket.user.id, name: socket.user.name });
  });

  socket.on('dm_typing_stop', ({ recipientId }) => {
    if (!recipientId) return;
    io.to(userRoom(recipientId)).emit('dm_typing_stop', { userId: socket.user.id });
  });
}

module.exports = registerChatHandlers;
