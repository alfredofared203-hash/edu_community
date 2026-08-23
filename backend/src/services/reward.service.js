const Reward = require('../models/Reward');
const UserReward = require('../models/UserReward');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const list = () => Reward.find().sort({ createdAt: -1 });

const create = ({ body, userId }) => Reward.create({ ...body, createdBy: userId });

const remove = async (id) => {
  const r = await Reward.findByIdAndDelete(id);
  if (!r) throw ApiError.notFound('المكافأة غير موجودة');
  await UserReward.deleteMany({ reward: id });
};

// مكافآت المستخدم الحالي
const myRewards = async (userId) => {
  const rows = await UserReward.find({ user: userId }).populate('reward');
  return rows.map((r) => r.reward);
};

// منح مكافأة لمستخدم
const grant = async (userId, rewardId) => {
  const reward = await Reward.findById(rewardId);
  if (!reward) throw ApiError.notFound('المكافأة غير موجودة');
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('المستخدم غير موجود');
  try {
    await UserReward.create({ user: userId, reward: rewardId });
  } catch (e) {
    if (e.code === 11000) throw ApiError.conflict('المستخدم يمتلك هذه المكافأة بالفعل');
    throw e;
  }
};

// إلغاء مكافأة
const revoke = async (userId, rewardId) => {
  const deleted = await UserReward.findOneAndDelete({ user: userId, reward: rewardId });
  if (!deleted) throw ApiError.notFound('المكافأة غير ممنوحة لهذا المستخدم');
};

// كل المستخدمين مع مكافآتهم (للأدمن)
const usersWithRewards = async () => {
  const users = await User.find({ role: 'student' }).select('name email points');
  const allUserRewards = await UserReward.find().populate('reward');

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    points: u.points,
    rewards: allUserRewards
      .filter((ur) => ur.user.toString() === u.id.toString())
      .map((ur) => ({ id: ur.reward?.id, rewardId: ur.reward?.id, title: ur.reward?.title })),
  }));
};

module.exports = { list, create, remove, myRewards, grant, revoke, usersWithRewards };
