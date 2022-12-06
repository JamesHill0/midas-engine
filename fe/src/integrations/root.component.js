import React, { useEffect, useState } from "react";
import { Layout, notification } from "antd";
import api from "../data";

import { Loader } from "../utils/ui_helper";
import IntegrationsTable from "./integrations.table";
import IntegrationsStats from "./integrations.stats";

const { Content } = Layout;

function Integrations() {
    const [isLoading, setIsLoading] = useState(false);
    const [integrationsList, setIntegrationsList] = useState([]);

    useEffect(() => {
        loadIntegrationsList();
    }, []);

    function loadIntegrationsList() {
        setIsLoading(true);
        api.Integration("integrations").Get({}, response => {
            if (response.Error == null) {
                const data = response.Data;
                setIntegrationsList(data);
                setIsLoading(false);
                return;
            }

            notification["error"]({
                placement: "bottomRight",
                message: "500",
                description: "Internal Server Error"
            })
            setIsLoading(false);
        })
    }

    return (
        <div className="integrations">
            {isLoading && <Loader />}
            <IntegrationsStats integrationsList={integrationsList} />
            <br />
            <IntegrationsTable integrationsList={integrationsList} />
        </div >
    )
}

export default Integrations;
