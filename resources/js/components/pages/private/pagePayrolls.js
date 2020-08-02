import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Input, Select, InputNumber } from "antd";
import Title from "antd/lib/typography/Title";
import CardPayrollList from "./pagePayrolls/cardPayrollList";
import CardNewPayroll from "./pagePayrolls/cardNewPayroll";

const PagePayrolls = () => {
    const [showCardNewPayroll, setShowCardNewPayroll] = useState(true);
    return (
        <>
            <Row style={{ marginLeft: "-10px", marginRight: "-10px" }}>
                <Col xs={24} md={24}>
                    <Button
                        type="primary"
                        onClick={e =>
                            setShowCardNewPayroll(!showCardNewPayroll)
                        }
                    >
                        {showCardNewPayroll ? "List" : "New"}
                    </Button>
                </Col>
            </Row>
            <Row style={{ marginLeft: "-10px", marginRight: "-10px" }}>
                <Col xs={24} md={24}>
                    {!showCardNewPayroll ? (
                        <CardPayrollList />
                    ) : (
                        <CardNewPayroll />
                    )}
                </Col>
            </Row>
        </>
    );
};

export default PagePayrolls;
