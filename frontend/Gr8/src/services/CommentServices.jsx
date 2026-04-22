import ApiClient from "../api/ApiClient";

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
};

export default CommentServices;
