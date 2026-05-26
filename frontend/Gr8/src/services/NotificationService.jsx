import ApiClient from "../api/ApiClient";

const NotificationService = {
    getAll: async () => {
        const response = await ApiClient.get("/forum/notifications")
        return response.data;
    },
    markAsSeen: async (notificationId) => {
        await ApiClient.put(`/forum/notifications/${notificationId}/seen`);
    },
}
export default NotificationService; 