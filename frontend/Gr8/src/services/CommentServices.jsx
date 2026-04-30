import ApiClient from "../api/ApiClient";

// Here we define the CommentServices object that contains methods for interacting with the forum comments API.
// Each method corresponds to a specific API endpoint and HTTP method, allowing us to create, delete, retrieve, report, and update comments.
const CommentServices = {
  getAll: async (postId) => {
    const response = await ApiClient.get(`/forum/posts/${postId}/comments`);
    return response.data;
  },
  create: async (postId, commentData) => {
    const response = await ApiClient.post(`/forum/posts/${postId}/comments`, {
      Content: commentData.commentContent,
    });
    return response.data;
  },
  report: async (commentId, reportData) => {
    const response = await ApiClient.post("/forum/report/", {
      commentId,
      reason: reportData.reason
    });
    return response.data;
  },
  deleteComment: async (commentId) => {
    const response = await ApiClient.delete(`/forum/comments/${commentId}`);
    return response.data;
  },
  update: async (postId, commentId, data) => {
    const response = await ApiClient.put(`/forum/posts/${postId}/comments/${commentId}`, data);
    return response.data;
  },
  hugComment: async (commentId, userId) => {
    const response = await ApiClient.post(`/forum/comments/${commentId}/hug`, {
      userId
    });
    return response.data;
  }
};

export default CommentServices;
