import React from "react";
import Title from "antd/lib/typography/Title";
import { Row, Col, Button } from "antd";

const PageHeader = ({ title, history }) => {
    return (
        <>
            <Title level={3}>{title}</Title>
            <Row style={{ marginLeft: "-10px", marginRight: "-10px" }}>
                <Col xs={24} md={18}>
                    <Button type="primary" onClick={e => history.goBack()}>
                        Back
                    </Button>
                </Col>
                <Col xs={24} md={6}></Col>
            </Row>
        </>
    );
};

export default PageHeader;
