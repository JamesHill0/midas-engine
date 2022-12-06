import React from "react";
import LoaderComponent from "react-fullpage-custom-loader";

import { notification } from "antd";

export class Loader extends React.Component {
    render() {
        return <LoaderComponent sentences={["Loading..."]} loaderType={"fire"} color={"orange"}/>
    }
}

export function notify(type, message, description) {
    notification[type]({
        placement: "bottomRight",
        message: message,
        description: description
    })
}
