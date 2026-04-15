import ApiClient from "../api/ApiClient"

const CommentServices = {
    getAll: async (postId) => {
        const response = await ApiClient.get(`/forum/posts/${postId}/comments`);
        return response.data;
    },
    create: async (postId, commentData) => {
        const response = await ApiClient.post(`/forum/posts/${postId}/comments`,{
            Content : commentData.commentContent
        });
        return response.data;
    } 
};

export default CommentServices;