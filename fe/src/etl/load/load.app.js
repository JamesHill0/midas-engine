import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import Load from "./root.component.js";

function domElementGetter() {
    return document.getElementById("etl-load");
}

const reactLifecycles = singleSpaReact({
    React,
    ReactDOM,
    rootComponent: Load,
    domElementGetter
});

export const bootstrap = [reactLifecycles.bootstrap];

export const mount = [reactLifecycles.mount];

export const unmount = [reactLifecycles.unmount];
