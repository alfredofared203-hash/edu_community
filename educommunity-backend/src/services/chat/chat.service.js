const Message = require('../../models/Message');
const User = require('../../models/User');

async function saveMessage({ sender, grade, content }) {
  const msg = await Message.create({ sender, grade, content });
  return msg.populate('sender', 'name role');
}


async function getMessages({ grade, page = 1, limit = 20 }) {
  const skip = (page - 1) * limit;
  const [messages, total] = await Promise.all([
    Message.find({ grade })
      .populate('sender', 'name role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Message.countDocuments({ grade }),
  ]);
  return { messages, total, page, limit, totalPages: Math.ceil(total / limit) };
}


async function saveDM({ sender, recipientId, content }) {
 
  const recipientExists = await User.exists({ _id: recipientId });
  if (!recipientExists) return null;

  const msg = await Message.create({ sender, recipient: recipientId, content });
  return msg.populate('sender', 'name role');
}


async function getDMHistory({ userId, otherId, page = 1, limit = 20 }) {
  const skip = (page - 1) * limit;
  
  const filter = {
    recipient: { $ne: null },
    $or: [
      { sender: userId,  recipient: otherId },
      { sender: otherId, recipient: userId },
    ],
  };
  const [messages, total] = await Promise.all([
    Message.find(filter)
      .populate('sender', 'name role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Message.countDocuments(filter),
  ]);
  return { messages, total, page, limit, totalPages: Math.ceil(total / limit) };
}

module.exports = { saveMessage, getMessages, saveDM, getDMHistory };
