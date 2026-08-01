const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const service = require('../services/reward.service');

exports.list = asyncHandler(async (req, res) => {
  const rewards = await service.list();
  sendSuccess(res, { data: { rewards } });
});

exports.create = asyncHandler(async (req, res) => {
  const reward = await service.create({ body: req.body, userId: req.user.id });
  sendSuccess(res, { statusCode: 201, message: 'تم إنشاء المكافأة', data: { reward } });
});

exports.remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id);
  sendSuccess(res, { message: 'تم حذف المكافأة' });
});

exports.myRewards = asyncHandler(async (req, res) => {
  const rewards = await service.myRewards(req.user.id);
  sendSuccess(res, { data: { rewards } });
});

exports.grant = asyncHandler(async (req, res) => {
  await service.grant(req.params.userId, req.params.rewardId);
  sendSuccess(res, { message: 'تم منح المكافأة' });
});

exports.revoke = asyncHandler(async (req, res) => {
  await service.revoke(req.params.userId, req.params.rewardId);
  sendSuccess(res, { message: 'تم إلغاء المكافأة' });
});

exports.usersWithRewards = asyncHandler(async (req, res) => {
  const users = await service.usersWithRewards();
  sendSuccess(res, { data: { users } });
});
