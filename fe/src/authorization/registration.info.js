import React from "react";
import { navigateToUrl } from "single-spa";

import { Button } from "antd";

function RegistrationInfo() {
    return (
        <div class="login-child login-registration-info">
            <div style={{ marginTop: "32%" }}>
                <h1 style={{ color: "whitesmoke" }}>Don't have an account with us?</h1>

                <h1 style={{ color: "whitesmoke" }}>Click here to register</h1>
                <Button type="primary" onClick={() => navigateToUrl("/registration")} size={"large"}>Register</Button>
            </div>
        </div>
    )
}

export default RegistrationInfo;
