import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import EtlViewData from "./root.component.js";

function domElementGetter() {
  return document.getElementById("etl-view-data");
}

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: EtlViewData,
  domElementGetter
});

export const bootstrap = [reactLifecycles.bootstrap];

export const mount = [reactLifecycles.mount];

export const unmount = [reactLifecycles.unmount];
