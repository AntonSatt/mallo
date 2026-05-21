import ApiClient from "../api/ApiClient";

const UserServices = {
    login: async (credentials) => {
        const response = await ApiClient.post("/auth/login", {
            userName: credentials.userName,
            password: credentials.password
        });
        const token = response.data.token;
        localStorage.setItem("token", token);
        return response.data;
    },
    register: async (userData) => {
        const response = await ApiClient.post("/auth/register", {
            userName: userData.userName,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password,
            socialNumber: userData.ssn,
            avatar: userData.avatar
        });
        const token = response.data.token;
        localStorage.setItem("token", token);
        return response.data;
    },
    logout: () => {
        localStorage.removeItem("token");
    },
    delete: async () => {
        const response = await ApiClient.delete("/users/me");
        UserServices.logout();
        return response.data;
    },
    getUser: async () => {
        const response = await ApiClient.get("/users/me");
        return response.data;
    },
    updateUser: async (userData) => {
        const response = await ApiClient.put("/users/me", {
            avatar: userData.avatar,
            userName: userData.userName,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email
        });
        return response.data;
    },
    updateUserTags: async (tagIds) => {
        const response = await ApiClient.patch("/users/me/tags", {
            tagIds: tagIds ?? []
        });
        return response.data;
    },
    updatePassword: async (userData) => {
        const response = await ApiClient.patch("/users/me/password", {
           currentPassWord: userData.currentPassword,
           newPassword: userData.newPassword,
           confirmNewPassword: userData.confirmNewPassword
        });
        return response.data;
    }
};

export default UserServices