import React from "react";
import Text from "antd/lib/typography/Text";
import { Form, Input, DatePicker } from "antd";

const FormClientBasicInfo = () => {
    return (
        <>
            <Text>Basic Information</Text>
            <Form.Item
                label="Client Name"
                name="name"
                rules={[
                    {
                        required: true,
                        min: 3,
                        message: "Client Name must be at least 3 characters"
                    }
                ]}
                className="mb-15"
            >
                <Input name="name" />
            </Form.Item>
            <Form.Item label="Address" name="address" className="mb-15">
                <Input name="address" />
            </Form.Item>
            <Form.Item
                label="Contact Number"
                name="contact_number"
                className="mb-15"
            >
                <Input name="contact_number" />
            </Form.Item>
            <Form.Item
                label="Client Since"
                name="client_since"
                className="mb-15"
            >
                <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>
        </>
    );
};

export default FormClientBasicInfo;
