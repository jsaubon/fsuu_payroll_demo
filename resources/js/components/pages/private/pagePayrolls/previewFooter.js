import React from "react";
import { Col, Input } from "antd";
import Text from "antd/lib/typography/Text";

const PreviewFooter = () => {
    return (
        <>
            <Col xs={0} md={3}></Col>
            <Col xs={8} md={4}>
                <Text>
                    <i>Prepared By:</i>
                </Text>
                <br />
                <br />
                <br />
                <Input className="br-b-only pl-0" />
                <Text>
                    <i>Cashier/Payroll In-Charge</i>
                </Text>
            </Col>
            <Col xs={0} md={3}></Col>
            <Col xs={8} md={4}>
                <Text>
                    <i>Checked By:</i>
                </Text>
                <br />
                <br />
                <br />
                <Input className="br-b-only pl-0" />
                <Text>
                    <i>Internal Auditor</i>
                </Text>
            </Col>
            <Col xs={0} md={3}></Col>
            <Col xs={8} md={4}>
                <Text>
                    <i>Approved By:</i>
                </Text>
                <br />
                <br />
                <br />
                <Input className="br-b-only pl-0" />
                <Text>
                    <i>VP-Finance/Treasurer</i>
                </Text>
            </Col>
        </>
    );
};

export default PreviewFooter;
