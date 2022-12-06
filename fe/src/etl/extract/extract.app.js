import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import Extract from "./root.component.js";

function domElementGetter() {
    return document.getElementById("etl-extract");
}

const reactLifecycles = singleSpaReact({
    React,
    ReactDOM,
    rootComponent: Extract,
    domElementGetter
});

export const bootstrap = [reactLifecycles.bootstrap];

export const mount = [reactLifecycles.mount];

export const unmount = [reactLifecycles.unmount];
