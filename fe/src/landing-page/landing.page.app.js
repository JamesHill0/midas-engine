import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import LandingPage from "./root.component.js";

function domElementGetter() {
    return document.getElementById("landing-page");
}

const reactLifecycles = singleSpaReact({
    React,
    ReactDOM,
    rootComponent: LandingPage,
    domElementGetter
});

export const bootstrap = [reactLifecycles.bootstrap];

export const mount = [reactLifecycles.mount];

export const unmount = [reactLifecycles.unmount];
