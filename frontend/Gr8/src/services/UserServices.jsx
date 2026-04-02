import ApiClient from "../api/ApiClient";

const UserServices = {
    login: async (userName, password) => {
        const response = await ApiClient.post("/login", {
            userName: userName,
            password: password
        });
        const token = response.data.token;
        localStorage.setItem("token", token);
        return response.data;
    },
    register: async (userName, name, email, password) => {
        const response = await ApiClient.post("/register", {
            userName: userName,
            name: name,
            email: email,
            password: password
        });
        const token = response.data.token;
        localStorage.setItem("token", token);
        return response.data;
    },
    logout: () => {
        localStorage.removeItem("token");
    },
    delete: async (userName) => {
        const response = await ApiClient.delete("/delete", userName);
        this.logout();
        return response.data;
    }
};

export default UserServices