import React from "react";
import { Form, Row, Col, InputNumber, Input, Button, Select } from "antd";
import { fetchData } from "../../../../../../axios";

const FormAddDebitCredit = ({ client_id, getClientAccountingEntry, type }) => {
    const submitDebitForm = e => {
        let data = {
            ...e,
            client_id,
            type
        };
        console.log(e);

        fetchData("POST", "api/accounting_entry", data).then(res => {
            console.log(res);
            if (res.success) {
                getClientAccountingEntry();
                formAddDebitCredit.resetFields();
            }
        });
    };

    const capitalize = s => {
        if (typeof s !== "string") return "";
        return s.charAt(0).toUpperCase() + s.slice(1);
    };

    let formAddDebitCredit;
    return (
        <>
            <Form
                name="basic"
                onFinish={e => submitDebitForm(e)}
                onFinishFailed={e => console.log(e)}
                ref={e => (formAddDebitCredit = e)}
            >
                <Row>
                    <Col xs={24} md={10} className="px-0">
                        <Form.Item
                            className="px-0"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input Title"
                                }
                            ]}
                        >
                            <Input placeholder="Title" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={4} className="px-0">
                        <Form.Item
                            className="px-0"
                            name="amount"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input Amount"
                                }
                            ]}
                        >
                            <InputNumber
                                style={{ width: "100%" }}
                                placeholder="Amount"
                                min={0}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={6} className="px-0">
                        <Form.Item
                            className="px-0"
                            name="report_visibility"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select Report Visibility"
                                }
                            ]}
                        >
                            <Select
                                style={{ width: "100%" }}
                                placeholder="Show on Report?"
                            >
                                <Select.Option value={1}>Yes</Select.Option>
                                <Select.Option value={0}>No</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={4} className="px-0">
                        <Button type="primary" htmlType="submit" block>
                            Add {capitalize(type)}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
};

export default FormAddDebitCredit;
