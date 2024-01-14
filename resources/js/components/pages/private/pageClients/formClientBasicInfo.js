import React from "react";
import Text from "antd/lib/typography/Text";
import { Form, Input, DatePicker, Select } from "antd";

const FormClientBasicInfo = () => {
    return (
        <>
            <Text>Basic Information</Text>
            {/* <Form.Item
                label="Department Type"
                name="type"
                rules={[
                    {
                        required: true,
                        message: "Select Department Type"
                    }
                ]}
                className="mb-15"
            >
                <Select name="type">
                    <Select.Option value="Fulltime">Fulltime</Select.Option>
                    <Select.Option value="Part Time">Part Time</Select.Option>
                </Select>
            </Form.Item> */}
            <Form.Item
                label="Department Name"
                name="name"
                rules={[
                    {
                        required: true,
                        min: 3,
                        message: "Department Name must be at least 3 characters"
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
            {/* <Form.Item
                label="Client Since"
                name="client_since"
                className="mb-15"
            >
                <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item> */}
        </>
    );
};

export default FormClientBasicInfo;
