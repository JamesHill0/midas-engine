import React from "react";

import { Layout } from "antd";
const { Footer } = Layout;

function FooterComponent() {
    const [author, setAuthor] = useState("https://www.blitzservices.co")

    return (
        <Footer>
            <center>
                {author}
            </center>
        </Footer>
    )
}

export default FooterComponent();
