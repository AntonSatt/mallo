import ApiClient from "../api/ApiClient";

const UserServices = {
    login: (userName, password) => {
        ApiClient.post("/login", {
            userName: userName,
            password: password
        }).then((response) => {
            console.log(response);
        });
    }
};

export default UserServices