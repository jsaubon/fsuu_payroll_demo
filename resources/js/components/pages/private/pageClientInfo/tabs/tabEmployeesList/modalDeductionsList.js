import React, { useEffect, useState } from "react";
import {
    Modal,
    Row,
    Col,
    Input,
    Select,
    Form,
    Card,
    DatePicker,
    Button,
    Table,
    Divider,
    Popconfirm
} from "antd";
import { fetchData } from "../../../../../../axios";
import Title from "antd/lib/typography/Title";
import { DeleteOutlined } from "@ant-design/icons";
import moment from "moment";

const ModalDeductionsList = ({
    showModalDeductionsList,
    toggleShowModalDeductionsList,
    employee
}) => {
    // console.log(employee);
    const [formLoading, setFormLoading] = useState(false);
    useEffect(() => {
        getEmployeeDeductions();
        return () => {};
    }, []);

    const [dataSource, setDataSource] = useState([]);

    const getEmployeeDeductions = () => {
        fetchData(
            "GET",
            "api/employee_deduction?employee_id=" + employee.id
        ).then(res => {
            console.log(res);
            if (res.success) {
                if (res.data) {
                    let dataSource = [];
                    res.data.map((deduction, key) => {
                        dataSource.push({
                            ...deduction,
                            key: key,
                            date_applied: moment(deduction.date_applied).format(
                                "YYYY-MM-DD"
                            )
                        });
                    });

                    setDataSource([...dataSource]);
                }
            }
        });
    };

    const submitForm = e => {
        let data = {
            ...e,
            employee_id: employee.id,
            date_applied: e.date_applied.format("YYYY-MM-DD")
        };
        setFormLoading(true);

        fetchData("POST", "api/employee_deduction", data).then(res => {
            if (res.success) {
                setFormLoading(false);
                getEmployeeDeductions();
            }
        });
    };

    const handleDeleteDeduction = record => {
        fetchData("DELETE", "api/employee_deduction/" + record.id).then(res => {
            if (res.success) {
                getEmployeeDeductions();
            }
        });
    };

    const columns = [
        {
            title: "Deduction",
            dataIndex: "deduction",
            key: "deduction"
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount"
        },
        {
            title: "Date Applied",
            dataIndex: "date_applied",
            key: "date_applied"
        },
        {
            title: "Action",
            key: "action",
            width: 100,
            render: (text, record) => {
                return (
                    <>
                        <Button
                            size="small"
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                        >
                            <Popconfirm
                                title="Are you sure delete this deduction?"
                                onConfirm={e => handleDeleteDeduction(record)}
                                okText="Yes"
                                cancelText="No"
                            >
                                Delete
                            </Popconfirm>
                        </Button>
                    </>
                );
            }
        }
    ];
    return (
        <>
            <Modal
                title="Employee Deductions"
                visible={showModalDeductionsList}
                onOk={e => toggleShowModalDeductionsList()}
                onCancel={toggleShowModalDeductionsList}
                // confirmLoading={formSaveLoading}
                width="90%"
                style={{ top: 20 }}
                okText="Close"
            >
                <Form
                    name="basic"
                    onFinish={e => submitForm(e)}
                    onFinishFailed={e => console.log(e)}
                >
                    <Card>
                        <Title level={4}>New Deduction</Title>
                        <Row>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Deduction"
                                    name="deduction"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Select Deduction"
                                        }
                                    ]}
                                >
                                    <Select placeholder="Select Deduction">
                                        <Select.Option value="C/A">
                                            Cash Advance
                                        </Select.Option>
                                        <Select.Option value="Canteen">
                                            Canteen
                                        </Select.Option>
                                        <Select.Option value="Ammos & Accessories">
                                            Ammos & Accessories
                                        </Select.Option>
                                        <Select.Option value="Misc.">
                                            Misc.
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={5}>
                                <Form.Item
                                    label="Amount"
                                    name="amount"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Input Amount"
                                        }
                                    ]}
                                >
                                    <Input placeholder="Amount" min={0} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={7}>
                                <Form.Item
                                    label="Date Applied"
                                    name="date_applied"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Pick Date Applied"
                                        }
                                    ]}
                                >
                                    <DatePicker
                                        placeholder="Select Date Applied"
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={4}>
                                <Button
                                    type="primary"
                                    block
                                    loading={formLoading}
                                    htmlType="submit"
                                >
                                    Save
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                </Form>
                <Divider />
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    size="small"
                />
            </Modal>
        </>
    );
};

export default ModalDeductionsList;
