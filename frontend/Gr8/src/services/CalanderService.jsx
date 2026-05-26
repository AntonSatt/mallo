import ApiClient from "../api/ApiClient";

const CalendarService = {
    getAll: () => ApiClient.get('/map/activities/calendar'),
    add: (activityId) => ApiClient.post(`/map/activities/${activityId}/calendar`),
    remove: (activityId) => ApiClient.delete(`/map/activities/${activityId}/calendar`),
};

export default CalendarService;