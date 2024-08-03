import React, {useState} from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import "./adSizeColor.scss";
import AdSize from "./AdSize";
import AdColor from "./AdColor";

const AdSizeColor = () => {

    const [keyTab, setKeyTab] = useState("manage-size");

    return (
        <div className="page-inner">
            <Tabs
                id="sizes-colors-tab"
                activeKey={keyTab}
                onSelect={(key) => setKeyTab(key)}
                fill
                variant={"tabs"}
            >
                <Tab eventKey="manage-size" title="Quản lý Size">
                    <AdSize />
                </Tab>
                <Tab eventKey="manage-color" title="Quản lý Màu sắc">
                    <AdColor />
                </Tab>
            </Tabs>
        </div>
    );
};

export default AdSizeColor;