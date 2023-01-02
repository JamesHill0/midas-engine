import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import EtlSubworkflows from "./root.component.js";

function domElementGetter() {
  return document.getElementById("etl-sub-workflows");
}

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: EtlSubworkflows,
  domElementGetter
});

export const bootstrap = [reactLifecycles.bootstrap];

export const mount = [reactLifecycles.mount];

export const unmount = [reactLifecycles.unmount];
