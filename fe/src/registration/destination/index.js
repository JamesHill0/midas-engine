import React from "react";

import { IntegrationsImage } from "../../assets/image";

import { Card } from "antd";

const { Meta } = Card;

function Destination() {
    function availableDestinations() {
        let destinations = [
            {
                imageSource: IntegrationsImage,
                title: "Salesforce",
                description: "https://www.salesforce.com"
            }
        ]

        return destinations;
    }

    return (
        <div>
            {availableDestinations().map((availableDestination) => {
                return (
                    <Card
                        hoverable
                        className="destination-card"
                        cover={<img alt={availableDestination.title} src={availableDestination.imageSource} />}
                    >
                        <Meta title={availableDestination.title} description={availableDestination.description} />
                    </Card>
                )
            })}
        </div>
    );
}

export default Destination;
