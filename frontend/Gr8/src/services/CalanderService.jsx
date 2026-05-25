import axios from 'axios';

const CalendarService = {
    getAll: () => axios.get('/map/activities/calendar'),
    add: (activityId) => axios.post(`/map/activities/${activityId}/calendar`),
    remove: (activityId) => axios.delete(`/map/activities/${activityId}/calendar`),
};

export default CalendarService;