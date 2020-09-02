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
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import moment from "moment";
import ButtonGroup from "antd/lib/button/button-group";
import TabReportsDebitCredit from "../../../pageReports/tabReportsDebitCredit";
import TableAccountingEntriesByEmployee from "../tabDebitCreditSettings/tableAccountingEntriesByEmployee";

const ModalAssignedPosts = ({
    showModalAssignedPosts,
    toggleShowModalAssignedPosts,
    employee,
    history
}) => {
    // console.log("employee", employee);
    const [formLoading, setFormLoading] = useState(false);
    const [formLoadingReassign, setFormLoadingReassign] = useState(false);
    const [clientList, setClientList] = useState([]);
    useEffect(() => {
        getClients();
        getEmployeeAssignedPosts();
        return () => {};
    }, []);

    let formAssigned;
    let formReAssigned;
    const [dataSource, setDataSource] = useState([]);

    const getClients = () => {
        fetchData("GET", "api/client?sort=asc").then(res => {
            console.log(res);
            if (res.success) {
                setClientList(res.data);
            }
        });
    };

    const [totalCashbond, setTotalCashbond] = useState(0);
    const getEmployeeAssignedPosts = () => {
        fetchData(
            "GET",
            "api/employee_assigned_post?employee_id=" + employee.id
        ).then(res => {
            if (res.success) {
                // console.log("assigned post", res);
                if (res.data) {
                    setTotalCashbond(res.total_cashbond);
                    let dataSource = [];
                    res.data.map((assigned_post, key) => {
                        dataSource.push({
                            ...assigned_post,
                            key: key,
                            date_start: moment(assigned_post.date_start).format(
                                "YYYY-MM-DD"
                            ),
                            date_end: assigned_post.date_end
                                ? moment(assigned_post.date_end).format(
                                      "YYYY-MM-DD"
                                  )
                                : "-"
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
            date_start: e.date_start.format("YYYY-MM-DD"),
            date_end: e.date_end ? e.date_end.format("YYYY-MM-DD") : null
        };

        setFormLoading(true);
        fetchData(
            data.id ? "UPDATE" : "POST",
            "api/employee_assigned_post" + (data.id ? `/${data.id}` : ""),
            data
        ).then(res => {
            if (res.success) {
                setFormLoading(false);
                getEmployeeAssignedPosts();
                setResetFormFields(true);
            }
        });
    };

    const submitFormReassign = e => {
        let data = {
            ...e
        };
        setFormLoadingReassign(true);
        fetchData("UPDATE", "api/employee/" + employee.id, data).then(res => {
            if (res.success) {
                setFormLoadingReassign(false);
                getEmployeeAssignedPosts();
                setResetFormFields(true);
                history.push("/clients/" + e.client_id);
                location.reload();
            }
        });
    };

    const [resetFormFields, setResetFormFields] = useState(false);
    useEffect(() => {
        if (resetFormFields) {
            resetForm();
        }
        return () => {};
    }, [resetFormFields]);

    const handleDeleteAssignedPost = record => {
        fetchData("DELETE", "api/employee_assigned_post/" + record.id).then(
            res => {
                if (res.success) {
                    getEmployeeAssignedPosts();
                }
            }
        );
    };

    const handleEditAssignedPost = record => {
        let _record = {
            ...record,
            date_start: moment(record.date_start, "YYYY-MM-DD"),
            date_end:
                record.date_end != "-"
                    ? moment(record.date_end, "YYYY-MM-DD")
                    : undefined
        };
        formAssigned.setFieldsValue(_record);
    };

    const resetForm = () => {
        formAssigned.resetFields();
        formReAssigned.resetFields();
        setResetFormFields(false);
    };

    const columns = [
        {
            title: "Client Name",
            dataIndex: "client",
            key: "client",
            render: (text, record) => {
                return record.client.name;
            }
        },
        {
            title: "Date Start",
            dataIndex: "date_start",
            key: "date_end"
        },
        {
            title: "Date End",
            dataIndex: "date_end",
            key: "date_end"
        },
        {
            title: "Action",
            key: "action",
            width: 100,
            render: (text, record) => {
                return (
                    <>
                        <ButtonGroup>
                            <Button
                                size="small"
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={e => handleEditAssignedPost(record)}
                            >
                                Edit
                            </Button>
                            <Button
                                size="small"
                                type="primary"
                                danger
                                icon={<DeleteOutlined />}
                            >
                                <Popconfirm
                                    title="Are you sure delete this assigned post?"
                                    onConfirm={e =>
                                        handleDeleteAssignedPost(record)
                                    }
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    Delete
                                </Popconfirm>
                            </Button>
                        </ButtonGroup>
                    </>
                );
            }
        }
    ];

    const [employeeFilters, setEmployeeFilters] = useState([]);
    const [yearFilters, setYearFilters] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [
        employeeAccountingReports,
        setEmployeeAccountingReports
    ] = useState();

    const showReports = _accountEntry => {
        setEmployeeAccountingReports(null);
        fetchData(
            "GET",
            "api/employee_accounting/" + employee.id + "?per_employee=1"
        ).then(res => {
            if (res.success) {
                setEmployeeAccountingReports(res.data);
                let employee_filter = [];
                let year_filter = [];
                let _totalAmount = 0;
                res.data.map((accounting, key) => {
                    //console.log(accounting.client_employee_payroll.client_payroll.date_start);
                    let emp_temp = employee_filter.find(
                        p => p.text == accounting.client_employee.name
                    );
                    if (!emp_temp) {
                        employee_filter.push({
                            text: accounting.client_employee.name,
                            value: accounting.client_employee.name
                        });
                    }

                    let year_temp = year_filter.find(
                        p =>
                            p.text ==
                            moment(
                                accounting.client_employee_payroll
                                    .client_payroll.date_start
                            ).format("YYYY")
                    );

                    if (!year_temp) {
                        year_filter.push({
                            text: moment(
                                accounting.client_employee_payroll
                                    .client_payroll.date_start
                            ).format("YYYY"),
                            value: moment(
                                accounting.client_employee_payroll
                                    .client_payroll.date_start
                            ).format("YYYY")
                        });
                    }

                    _totalAmount += parseFloat(accounting.amount);
                });

                setYearFilters(year_filter);
                setTotalAmount(_totalAmount);
                setEmployeeFilters([...employee_filter]);
            }
        });
    };
    useEffect(() => {
        showReports();
        return () => {};
    }, []);

    return (
        <>
            <Modal
                title="Employee Assigned Posts"
                visible={showModalAssignedPosts}
                onOk={e => toggleShowModalAssignedPosts()}
                onCancel={toggleShowModalAssignedPosts}
                // confirmLoading={formSaveLoading}
                width="90%"
                style={{ top: 20 }}
                okText="Close"
            >
                <Form
                    name="basic"
                    onFinish={e => submitFormReassign(e)}
                    onFinishFailed={e => console.log(e)}
                    ref={e => (formReAssigned = e)}
                >
                    <Card>
                        <Title level={4}>Re-Assign Post</Title>
                        <Row>
                            <Col xs={24} md={8}>
                                <Form.Item name="id" className="hide">
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Select Client"
                                    name="client_id"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Select Client"
                                        }
                                    ]}
                                >
                                    <Select placeholder="Select Client">
                                        {clientList.map((client, key) => {
                                            return (
                                                <Select.Option
                                                    key={key}
                                                    value={client.id}
                                                >
                                                    {client.name} -{" "}
                                                    {client.type}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={4}>
                                <Button
                                    type="primary"
                                    block
                                    loading={formLoadingReassign}
                                    htmlType="submit"
                                >
                                    Save
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                </Form>
                <Divider />
                <Form
                    name="basic"
                    onFinish={e => submitForm(e)}
                    onFinishFailed={e => console.log(e)}
                    ref={e => (formAssigned = e)}
                >
                    <Card>
                        <Title level={4}>New Assigned Post</Title>
                        <Row>
                            <Col xs={24} md={8}>
                                <Form.Item name="id" className="hide">
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Select Client"
                                    name="client_id"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Select Client"
                                        }
                                    ]}
                                >
                                    <Select placeholder="Select Client">
                                        {clientList.map((client, key) => {
                                            return (
                                                <Select.Option
                                                    key={key}
                                                    value={client.id}
                                                >
                                                    {client.name} -{" "}
                                                    {client.type}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={6}>
                                <Form.Item
                                    label="Date Start"
                                    name="date_start"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Pick Date Start"
                                        }
                                    ]}
                                >
                                    <DatePicker
                                        placeholder="Select Date Start"
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={6}>
                                <Form.Item label="Date End" name="date_end">
                                    <DatePicker
                                        placeholder="Select Date End"
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
                {/* <div className="text-right mt-10">
                    <Title level={4}>
                        Total Cashbond: {currencyFormat(totalCashbond)}
                    </Title>
                </div> */}

                {/* <TabReportsDebitCredit employee={employee} /> */}
                <Divider />
                <Title level={4}>Cashbond</Title>
                <TableAccountingEntriesByEmployee
                    employeeAccountingReports={employeeAccountingReports}
                    totalAmount={totalAmount}
                    setTotalAmount={setTotalAmount}
                    employeeFilters={employeeFilters}
                    yearFilters={yearFilters}
                />
            </Modal>
        </>
    );
};

export default ModalAssignedPosts;
