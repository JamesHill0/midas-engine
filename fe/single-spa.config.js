import "antd/dist/antd.css";
import "./style.css";
import { registerApplication, start } from "single-spa";

// This will check if the route is on current path --
function onCurrentRoute(path) {
    if (location.pathname.startsWith(path)) return true;
    return false;
}

// This will check if there is a valid access token saved in local storage --
function currentlyLoggedIn() {
    let token = localStorage.getItem("access_token");
    if (token != null) {
        document.getElementById("content").style.visibility = "visible";
        return true;
    }
    document.getElementById("content").style.visibility = "hidden";
    return false;
}

function registrationPage() {
    if (location.pathname.startsWith("/registration")) return true;
    return false;
}

// Registers SPA Applications --
registerApplication(
    "authorization",
    () => import("./src/authorization/authorization.app.js"),
    () => !currentlyLoggedIn() && !registrationPage()
);

registerApplication(
    "landing-page",
    () => import("./src/landing-page/landing.page.app.js"),
    () => onCurrentRoute("/")
)

registerApplication(
    "appbar",
    () => import("./src/appbar/appbar.app.js"),
    () => currentlyLoggedIn() && !registrationPage()
);

registerApplication(
    "registration",
    () => import("./src/registration/registration.app.js"),
    () => !currentlyLoggedIn() && onCurrentRoute("/registration")
)

registerApplication(
    "dashboard",
    () => import("./src/dashboard/dashboard.app.js"),
    () => currentlyLoggedIn() && onCurrentRoute("/dashboard")
)

registerApplication(
    "integrations",
    () => import("./src/integrations/integrations.app.js"),
    () => currentlyLoggedIn() && onCurrentRoute("/integrations")
)

registerApplication(
    "etl-extract",
    () => import("./src/etl/extract/extract.app.js"),
    () => currentlyLoggedIn() && onCurrentRoute("/etl/extract")
)

registerApplication(
    "etl-transform",
    () => import("./src/etl/transform/transform.app.js"),
    () => currentlyLoggedIn() && onCurrentRoute("/etl/transform")
)

registerApplication(
    "etl-load",
    () => import("./src/etl/load/load.app.js"),
    () => currentlyLoggedIn() && onCurrentRoute("/etl/load")
)

registerApplication(
    "settings-users",
    () => import("./src/settings/users/users.app.js"),
    () => currentlyLoggedIn() && onCurrentRoute("/settings/users")
)

start();
