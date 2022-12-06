import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import Appbar from "./root.component.js";

function domElementGetter() {
    return document.getElementById("appbar");
}

const reactLifecycles = singleSpaReact({
    React,
    ReactDOM,
    rootComponent: Appbar,
    domElementGetter
});

export const bootstrap = [reactLifecycles.bootstrap];

export const mount = [reactLifecycles.mount];

export const unmount = [reactLifecycles.unmount];