import { request, qs, tokenStore } from "./apiClient";

const api = {
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  getMe: () => request("/auth/me"),

  getSubjects: (grade) => request("/subjects" + (grade ? "?grade=" + encodeURIComponent(grade) : "")),
  createSubject: (body) => request("/subjects", { method: "POST", body: JSON.stringify(body) }),

  getMaterials: (params = {}) => request("/materials" + qs(params)),
  getMaterial: (id) => request("/materials/" + id),
  createMaterial: (formData) => request("/materials", { method: "POST", body: formData }),
  deleteMaterial: (id) => request("/materials/" + id, { method: "DELETE" }),

  getPosts: () => request("/posts"),
  createPost: (formData) => request("/posts", { method: "POST", body: formData }),
  likePost: (id) => request("/posts/" + id + "/like", { method: "POST" }),
  getComments: (id) => request("/posts/" + id + "/comments"),
  createComment: (id, content) =>
    request("/posts/" + id + "/comments", {
      method: "POST",
      body: JSON.stringify({ content }),
    }),

  getChallenges: () => request("/challenges"),
  getSubmissions: () => request("/challenges/submissions"),
  submitChallenge: (id, answer) =>
    request("/challenges/" + id + "/submit", {
      method: "POST",
      body: JSON.stringify({ answer }),
    }),

  getLeaderboard: (grade) =>
    request("/leaderboard" + (grade ? "?grade=" + encodeURIComponent(grade) : "")),
  getSchools: () => request("/leaderboard/schools"),

  getTeachers: () => request("/teachers"),
  rateTeacher: (id, rating, comment) =>
    request("/teachers/" + id + "/rate", {
      method: "POST",
      body: JSON.stringify({ rating, comment }),
    }),

  getAdminStats: () => request("/admin/stats"),
  getAdminUsers: () => request("/admin/users"),
  deleteUser: (userId) =>
    request(`/admin/users/${userId}`, { method: "DELETE" }),

  getRoomMessages: (grade, params = {}) =>
    request(`/v1/chat/messages${qs({ grade, ...params })}`),

  getSoftSkills: () => request("/v1/softskills"),
  getSoftSkillSubmissions: (skillId) =>
    request(`/v1/softskills/${skillId}/submissions`),
  submitPresentation: (skillId, formData) =>
    request(`/v1/softskills/${skillId}/submit`, {
      method: "POST",
      body: formData,
    }),
  gradeSubmission: (submissionId, data) =>
    request(`/v1/softskills/submissions/${submissionId}/grade`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getNotifications: () => request("/v1/notifications"),
  markNotificationRead: (id) =>
    request(`/v1/notifications/${id}/read`, { method: "PATCH" }),
  markAllNotificationsRead: () =>
    request("/v1/notifications/read-all", { method: "PATCH" }),

  getRecommendedTeachers: (limit = 10) =>
    request(`/v1/recommendations/teachers${qs({ limit })}`),

  // ===== Rewards =====
  getRewards: () => request("/v1/rewards"),
  getMyRewards: () => request("/v1/rewards/my"),
  grantReward: (userId, rewardId) =>
    request("/v1/rewards/grant", {
      method: "POST",
      body: JSON.stringify({ userId, rewardId }),
    }),
  revokeReward: (userId, rewardId) =>
    request("/v1/rewards/revoke", {
      method: "POST",
      body: JSON.stringify({ userId, rewardId }),
    }),
  getUsersWithRewards: () => request("/v1/rewards/users"),
};

export { api, tokenStore };