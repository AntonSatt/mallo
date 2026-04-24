import ApiClient from "../api/ApiClient";

// Here we define the PostServices object that contains methods for interacting with the forum posts API. 
// Each method corresponds to a specific API endpoint and HTTP method, allowing us to create, delete, retrieve, report, and update posts.
const PostServices = {
    create: async (postData) => {
        const response = await ApiClient.post("/forum/posts", {
            title: postData.title,
            content: postData.content,
            categoryId: postData.categoryId,
            tagIds: postData.tags
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
    },
    report: async (postId, reportData) => {
        const response = await ApiClient.post(
            "/forum/report/",
            {
                postId, reason: reportData.reason
            }
        );
        return response.data;
    },
    update: async (postId, data) => {
        const response = await ApiClient.put(`/forum/posts/${postId}`, data);
        return response.data;
    },
    hugPost: async (postId, userId) => {
        const response = await ApiClient.Post('/forum/posts/')
    }
};

export default PostServices;