import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import Transform from "./root.component.js";

function domElementGetter() {
    return document.getElementById("etl-transform");
}

const reactLifecycles = singleSpaReact({
    React,
    ReactDOM,
    rootComponent: Transform,
    domElementGetter
});

export const bootstrap = [reactLifecycles.bootstrap];

export const mount = [reactLifecycles.mount];

export const unmount = [reactLifecycles.unmount];
