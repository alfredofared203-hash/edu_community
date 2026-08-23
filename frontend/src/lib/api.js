import { request, qs, tokenStore } from "./apiClient";

export { tokenStore };

// الباك بيرجع { success, message, data } — بنطلع الـ data مباشرة
const u = (res) => res?.data ?? res;

export const api = {
  // ===== Auth =====
  login:    (body) => request("/v1/auth/login",    { method: "POST", body: JSON.stringify(body) }).then(u),
  register: (body) => request("/v1/auth/register", { method: "POST", body: JSON.stringify(body) }).then(u),
  getMe:    ()     => request("/v1/auth/me").then(u),
  updateProfile: (formData) => request("/v1/auth/profile", { method: "PATCH", body: formData }).then(u),
  logout:   ()     => request("/v1/auth/logout", { method: "POST" }).catch(() => null),

  // ===== Subjects =====
  getSubjects:   (grade) => request(`/v1/subjects${qs({ grade })}`).then(u),
  createSubject: (body)  => request("/v1/subjects", { method: "POST", body: JSON.stringify(body) }).then(u),

  // ===== Materials =====
  getMaterials:   (params = {}) => request(`/v1/materials${qs(params)}`).then(u),
  getMaterial:    (id)          => request(`/v1/materials/${id}`).then(u),
  createMaterial: (formData)    => request("/v1/materials", { method: "POST", body: formData }).then(u),
  deleteMaterial: (id)          => request(`/v1/materials/${id}`, { method: "DELETE" }).then(u),

  // ===== Posts =====
  getPosts:      ()            => request("/posts").then(u),
  createPost:    (formData)    => request("/posts", { method: "POST", body: formData }).then(u),
  likePost:      (id)          => request(`/posts/${id}/like`, { method: "POST" }).then(u),
  getComments:   (id)          => request(`/posts/${id}/comments`).then(u),
  createComment: (id, content) => request(`/posts/${id}/comments`, { method: "POST", body: JSON.stringify({ content }) }).then(u),

  // ===== Challenges =====
  getChallenges:      ()           => request("/v1/challenges").then(u),
  getMySubmissions:   ()           => request("/v1/challenges/my-submissions").then(u),
  submitChallenge:    (id, answer) => request(`/v1/challenges/${id}/submit`, { method: "POST", body: JSON.stringify({ answer }) }).then(u),

  // ===== Leaderboard =====
  getLeaderboard: (grade) => request(`/leaderboard${qs({ grade })}`).then(u),
  getSchools:     ()      => request("/leaderboard/schools").then(u),

  // ===== Teachers =====
  getTeachers:  ()                    => request("/teachers").then(u),
  rateTeacher:  (id, rating, comment) => request(`/teachers/${id}/rate`, { method: "POST", body: JSON.stringify({ rating, comment }) }).then(u),

  // ===== Admin =====
  getAdminStats: () => request("/admin/stats").then(u),
  getAdminUsers: () => request("/admin/users").then(u),
  deleteUser:    (id) => request(`/admin/users/${id}`, { method: "DELETE" }).then(u),

  // ===== Chat =====
  getRoomMessages: (grade, params = {}) => request(`/v1/chat/messages${qs({ grade, ...params })}`).then(u),

  // ===== Rewards =====
  getRewards:          ()                 => request("/v1/rewards").then(u),
  getMyRewards:        ()                 => request("/v1/rewards/me").then(u),
  getUsersWithRewards: ()                 => request("/v1/rewards/users").then(u),
  createReward:        (data)             => request("/v1/rewards", { method: "POST", body: JSON.stringify(data) }).then(u),
  deleteReward:        (id)               => request(`/v1/rewards/${id}`, { method: "DELETE" }).then(u),
  grantReward:         (userId, rewardId) => request(`/v1/rewards/${userId}/${rewardId}`, { method: "POST" }).then(u),
  revokeReward:        (userId, rewardId) => request(`/v1/rewards/${userId}/${rewardId}`, { method: "DELETE" }).then(u),

  // ===== Soft Skills =====
  getSoftSkills:           ()            => request("/v1/softskills").then(u),
  getSoftSkillSubmissions: (skillId)     => request(`/v1/softskills/${skillId}/submissions`).then(u),
  submitPresentation:      (skillId, fd) => request(`/v1/softskills/${skillId}/submit`, { method: "POST", body: fd }).then(u),
  gradeSubmission:         (id, data)    => request(`/v1/softskills/submissions/${id}/grade`, { method: "POST", body: JSON.stringify(data) }).then(u),

  // ===== Notifications =====
  getNotifications:         ()   => request("/v1/notifications").then(u),
  markNotificationRead:     (id) => request(`/v1/notifications/${id}/read`, { method: "PATCH" }).then(u),
  markAllNotificationsRead: ()   => request("/v1/notifications/read-all", { method: "PATCH" }).then(u),
};
