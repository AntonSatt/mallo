import ApiClient from "../api/ApiClient";

const ActivityServices = {
    // Get all activities to display on the map
    getAll: async () => {
        const response = await ApiClient.get("/map/activities");
        return response.data;
    },

    // Create a new activity when the form is submitted
    create: async (activityData) => {
        const response = await ApiClient.post("/map/activities", activityData);
        return response.data;
    },

    // Get a single activity by ID 
    getById: async (id) => {
        const response = await ApiClient.get(`/map/activities/${id}`);
        return response.data;
    },
    delete: async (activityId) => {
        const response = await ApiClient.delete(`/map/activities/${activityId}`);
        return response.data;
    },
    update: async (id, updateDto) => {
        const response = await ApiClient.put(`/map/activities/${id}`, updateDto);
        return response.data;
    },
    toggleBookmark: async (activityId) => {
        const response = await ApiClient.post(`/map/activities/${activityId}/bookmark`);
        return response.data;
    },
    getBookmarks: async () => {
        const response = await ApiClient.get(`/map/activities/bookmarks`);
        return response.data;
    },
};

export default ActivityServices;