import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import Registration from "./root.component.js";

function domElementGetter() {
    return document.getElementById("registration");
}

const reactLifecycles = singleSpaReact({
    React,
    ReactDOM,
    rootComponent: Registration,
    domElementGetter
});

export const bootstrap = [reactLifecycles.bootstrap];

export const mount = [reactLifecycles.mount];

export const unmount = [reactLifecycles.unmount];
