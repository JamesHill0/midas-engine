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
    // let token = localStorage.getItem("access_token");
    // if (token != null) {
    //     document.getElementById("content").style.visibility = "visible";
    //     return true;
    // }
    // document.getElementById("content").style.visibility = "hidden";
    // return false;
    return true;
}

// Registers SPA Applications --
registerApplication(
    "authorization",
    () => import("./src/authorization/authorization.app.js"),
    () => !currentlyLoggedIn()
);

registerApplication(
    "appbar",
    () => import("./src/appbar/appbar.app.js"),
    () => currentlyLoggedIn()
);

registerApplication(
    "registration",
    () => import("./src/registration/registration.app.js"),
    () => onCurrentRoute("/registration")
)

registerApplication(
    "footer",
    () => import("./src/footer/footer.app.js"),
    () => currentlyLoggedIn()
);

start();
