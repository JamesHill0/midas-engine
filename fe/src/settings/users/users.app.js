import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import Users from "./root.component.js";

function domElementGetter() {
    return document.getElementById("settings-users");
}

const reactLifecycles = singleSpaReact({
    React,
    ReactDOM,
    rootComponent: Users,
    domElementGetter
});

export const bootstrap = [reactLifecycles.bootstrap];

export const mount = [reactLifecycles.mount];

export const unmount = [reactLifecycles.unmount];
