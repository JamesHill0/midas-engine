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
  "etl-workflows",
  () => import("./src/workflows/etl-workflows/etl.workflows.app.js"),
  () => currentlyLoggedIn() && onCurrentRoute("/workflows/etl-workflows")
)

registerApplication(
  "etl-sub-workflows",
  () => import("./src/workflows/etl-workflows/etl-subworkflows/etl.subworkflows.app.js"),
  () => currentlyLoggedIn() && onCurrentRoute("/workflows/etl-sub-workflows")
)

registerApplication(
  "etl-mappings",
  () => import("./src/workflows/etl-workflows/etl-mappings/etl.mappings.app.js"),
  () => currentlyLoggedIn() && onCurrentRoute("/workflows/etl-mappings")
)

registerApplication(
  "etl-view-data",
  () => import("./src/workflows/etl-workflows/etl-view-data/etl.view.data.app.js"),
  () => currentlyLoggedIn() && onCurrentRoute("/workflows/etl-view-data")
)

registerApplication(
  "settings-users",
  () => import("./src/settings/users/users.app.js"),
  () => currentlyLoggedIn() && onCurrentRoute("/settings/users")
)

start();
