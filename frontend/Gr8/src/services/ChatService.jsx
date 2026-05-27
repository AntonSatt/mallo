import ApiClient from "../api/ApiClient";

// Here we define the ChatService object that contains methods for interacting with the chat API.

const ChatService = {
    getConversations: async () => {
    const response = await ApiClient.get(`/chat/conversations`);

    console.log("GET conversations response:", response.data);

    return response.data;
},

    getChatHistory: async (otherUserId) => {
        const response = await ApiClient.get(`/chat/history/${otherUserId}`);
        return response.data;
    },

    deleteConversation: async (otherUserId) => {
        const response = await ApiClient.delete(`/chat/conversations/${otherUserId}`);
        return response.data;
    }
};

export default ChatService;