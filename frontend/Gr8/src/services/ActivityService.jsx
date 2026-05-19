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
};

export default ActivityServices;