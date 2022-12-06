import React from "react";
import { navigateToUrl } from "single-spa";
import { Card, Form, Input, Button, notification } from "antd";
import api from "../data";

import LoginForm from "./login.form";
import RegistrationInfo from "./registration.info";

function Authorization() {
    async function handleSubmit(values) {
        retrieveAccountApiKey(values, (apiKey) => {
            api
                .Authorization("users/login", { headers: { "x-api-key": apiKey } })
                .Post({ "username": values["username"], "password": values["password"] }, response => {
                    if (response.Error == null) {
                        let token = response.Data.access_token;
                        if (token != undefined) {
                            localStorage.setItem("access_token", token);
                            navigateToUrl("/dashboard");
                            window.location.reload();
                            notification["success"]({
                                placement: "bottomRight",
                                message: "Success",
                                description: "Successfully logged-in"
                            });

                            return
                        }
                    }

                    notification["error"]({
                        placement: "bottomRight",
                        message: "500",
                        description: "Failed to authorize user for login"
                    });
                });
        });
    }

    function retrieveAccountApiKey(values, callback) {
        api.Account(`accounts`)
            .Get({ "q_number": values["accountNumber"] }, response => {
                if (response.Error == null) {
                    let account = response.Data[0];
                    callback(account["apiKey"]);
                    return;
                }

                notification["error"]({
                    placement: "bottomRight",
                    message: "500",
                    description: "Failed to retrieve account number"
                });
            })
    }

    return (
        <div>
            <center>
                <Card
                    className="login-card"
                >
                    <div className="login-container">
                        <LoginForm handleSubmit={handleSubmit} />
                        <RegistrationInfo />
                    </div>
                </Card>
            </center>
        </div>
    );
}

export default Authorization;
