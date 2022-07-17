import axios from "axios";

export default class Axios {
    constructor() {
        let instance = axios.create();

        instance.interceptors.request.use(
            function (config) {
                // handle before request
                if (localStorage.getItem("access_token")) {
                    config.headers["Authorization"] = `Bearer ${localStorage.getItem("access_token")}`;
                }

                // for handling logging in
                if (config.url == "authorization/users/login") {
                    config.headers["x-api-key"] = `${process.env.APP_API_KEY}`;
                }
                return config;
            },
            function (error) {
                // handle request error
                console.log("handle global error");
                return Promise.reject(error);
            }
        );

        instance.interceptors.response.use(
            function (response) {
                return response;
            },
            function (err) {
                if (!err.response) {
                    return Promise.reject(err);
                }
                if (!err.response.config.disableErrorNotification) {
                    return Promise.reject(err);
                }
                return Promise.reject(err);
            }
        );

        return instance;
    }
}