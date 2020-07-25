import React, { useState, useEffect } from "react";
import Title from "antd/lib/typography/Title";
import {
    Card,
    Form,
    Input,
    Row,
    Col,
    Select,
    InputNumber,
    DatePicker,
    Button,
    notification
} from "antd";
import { fetchData } from "../../../../axios";

const FormNewPayrollData = ({ payrollDetails, setPayrollDetails }) => {
    const [form] = Form.useForm();
    const [employeesList, setEmployeesList] = useState([]);
    const [showLoading, setShowLoading] = useState(false);

    const submitForm = e => {
        console.log(e);
        let _employeeList = payrollDetails.employeeList;
        _employeeList.push(e);
        setPayrollDetails({ ...payrollDetails, employeeList: _employeeList });
        form.resetFields();
        notification.success({ message: e.employee_id + " Payroll Added" });
    };

    useEffect(() => {
        setShowLoading(true);
        fetchData(
            "GET",
            "api/employee?client_id=" + payrollDetails.client_id
        ).then(res => {
            console.log(res);
            if (res.success) {
                setShowLoading(false);
                setEmployeesList(res.data);
            }
        });

        return () => {};
    }, [payrollDetails.client_id]);

    return (
        <>
            <Title level={4}>New Payroll Data</Title>
            <Form
                // {...layout}
                // layout="inline"
                form={form}
                name="basic"
                onFinish={e => submitForm(e)}
                onFinishFailed={e => console.log(e)}
                // initialValues={payrollData}
            >
                <Row>
                    <Col xs={24} md={12} className="p-0">
                        <Form.Item
                            name="employee_id"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select Employee"
                                }
                            ]}
                        >
                            <Select
                                placeholder="Select Employee"
                                name="employee_id"
                                style={{ width: "100%" }}
                                allowClear
                                showSearch
                                loading={showLoading}
                            >
                                {employeesList.map((employee, key) => {
                                    return (
                                        <Select.Option
                                            key={key}
                                            value={employee.name}
                                        >
                                            {employee.name}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={5} className="p-0">
                        <Form.Item
                            name="days_present"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input Days Present"
                                }
                            ]}
                        >
                            <InputNumber
                                style={{ width: "100%" }}
                                name="days_present"
                                placeholder="Days Present"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={5} className="p-0">
                        <Form.Item
                            name="hours_overtime"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input Hours Overtime"
                                }
                            ]}
                        >
                            <InputNumber
                                style={{ width: "100%" }}
                                name="hours_overtime"
                                placeholder="Hours Overtime"
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={2}>
                        <Button type="primary" block htmlType="submit">
                            Add
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
};

export default FormNewPayrollData;
