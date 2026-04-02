import ApiClient from "../api/ApiClient";

const UserServices = {
    login: async (credentials) => {
        const response = await ApiClient.post("/login", {
            userName: credentials.userName,
            password: credentials.password
        });
        const token = response.data.token;
        localStorage.setItem("token", token);
        return response.data;
    },
    register: async (userData) => {
        const response = await ApiClient.post("/register", {
            userName: userData.userName,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password,
            socialNumber: userData.ssn
        });
        const token = response.data.token;
        localStorage.setItem("token", token);
        return response.data;
    },
    logout: () => {
        localStorage.removeItem("token");
    },
    delete: async (userData) => {
        const response = await ApiClient.delete("/delete", userData);
        this.logout();
        return response.data;
    }
};

export default UserServices