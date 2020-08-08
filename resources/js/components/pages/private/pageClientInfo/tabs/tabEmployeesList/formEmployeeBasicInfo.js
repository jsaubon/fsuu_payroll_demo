import React from "react";
import Text from "antd/lib/typography/Text";
import { Form, Input, DatePicker, Select } from "antd";

const FormEmployeeBasicInfo = () => {
    return (
        <>
            <Text>Basic Information</Text>
            <Form.Item
                label="Employee Name"
                name="name"
                rules={[
                    {
                        required: true,
                        min: 3,
                        message: "Employee Name must be at least 3 characters"
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
                label="Email Address"
                name="email_address"
                className="mb-15"
            >
                <Input name="email_address" type="email" />
            </Form.Item>
            <Form.Item
                label="Contact Number"
                name="contact_number"
                className="mb-15"
            >
                <Input name="contact_number" />
            </Form.Item>
            <Form.Item label="Birth Date" name="birth_date" className="mb-15">
                <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item
                label="Employee Since"
                name="member_since"
                className="mb-15"
            >
                <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item
                label="Status"
                name="status"
                className="mb-15"
                rules={[
                    {
                        required: true,
                        message: "Select Status"
                    }
                ]}
            >
                <Select name="status" width="100%">
                    <Select.Option value="Active">Active</Select.Option>
                    <Select.Option value="Inactive">Inactive</Select.Option>
                    <Select.Option value="Resigned">Resigned</Select.Option>
                </Select>
            </Form.Item>
        </>
    );
};

export default FormEmployeeBasicInfo;
