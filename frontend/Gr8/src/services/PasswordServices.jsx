import ApiClient from "../api/ApiClient";

const PasswordServices = {
    forgotPassword: async (email) => {
        const response = await ApiClient.post("/auth/forgot-password", { email });
        return response.data;
    },
    resetPassword: async (token, newPassword) => {
        const response = await ApiClient.post("/auth/reset-password", { token, newPassword });
        return response.data;
    }
};

export default PasswordServices;

