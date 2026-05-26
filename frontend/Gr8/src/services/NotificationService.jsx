import ApiClient from "../api/ApiClient";

const NotificationService = {
    getAll: async () => {
        const response = await ApiClient.get("/forum/notifications")
        return response.data;
    }
}
export default NotificationService; 