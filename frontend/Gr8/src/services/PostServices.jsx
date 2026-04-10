import ApiClient from "../api/ApiClient";

const PostServices = {
    create: async (postData) => {
        const response = await ApiClient.post("/forum/posts", {
            title: postData.postTitle,
            content: postData.postContent,
            categoryId: postData.categoryId,
            tagIds: postData.tagsIds
        });
        return response.data;
    },
    delete: async (postId) => {
        const response = await ApiClient.delete(`/forum/posts/${postId}`);
        return response.data;
    },
    getAll: async () => {
        const response = await ApiClient.get("/forum/posts");
        return response.data;
    },
    getTags: async () => {
        const response = await ApiClient.get("/forum/tags");
        return response.data;
    },
    getCategories: async () => {
        const response = await ApiClient.get("/forum/categories");
        return response.data;
    }
};

export default PostServices;