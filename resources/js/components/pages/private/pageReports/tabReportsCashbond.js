import React, { useEffect, useState } from "react";
import { Card, Table, Row, Col, Select } from "antd";
import Title from "antd/lib/typography/Title";
import { fetchData } from "../../../../axios";
import { Print } from "react-easy-print";

const TabReportsCashbond = () => {
    const [cashbonds, setCashbonds] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const [employeeList, setEmployeeList] = useState();
    const [filterEmployee, setFilterEmployee] = useState();

    useEffect(() => {
        getCashbond();
        return () => {};
    }, []);

    const getCashbond = () => {
        fetchData(
            "GET",
            `api/employee_assigned_post?report=1${
                filterEmployee ? "&employee=" + filterEmployee : ""
            }`
        ).then(res => {
            if (res.success) {
                setCashbonds(res.data);
                let _employeeFilter = [];
                let _subTotal = 0;
                res.data.map((data, key) => {
                    _subTotal += data.total;
                });
                setSubTotal(_subTotal);
                setEmployeeList(res.employees);
            }
        });
    };

    useEffect(() => {
        getCashbond();
        return () => {};
    }, [filterEmployee]);

    function currencyFormat(num) {
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }

    let columns = [
        {
            title: "Employee",
            dataIndex: "name",
            key: "name",
            render: (text, record) => {
                return record.name;
            },
            // filterMultiple: false,
            // onFilter: (value, record) =>
            // record.client_employee.name.indexOf(value) === 0,
            sorter: (a, b) => a.name.length - b.name.length,
            sortDirections: ["descend", "ascend"]
            // filters: [...employeeFilter]
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (text, record) => {
                return record.status;
            },
            filterMultiple: false,
            onFilter: (value, record) => record.status.indexOf(value) === 0,
            // sorter: (a, b) => a.name.length - b.name.length,
            // sortDirections: ["descend", "ascend"]
            filters: [
                {
                    text: "Active",
                    value: "Active"
                },
                {
                    text: "Inactive",
                    value: "Inactive"
                },
                {
                    text: "Resigned",
                    value: "Resigned"
                }
            ]
        },
        {
            title: "Clients",
            dataIndex: "clients",
            key: "clients",
            render: (text, record) => {
                // return record.name;
                let _cb = [];
                record.clients.map((client, key) => {
                    _cb.push(
                        <>
                            <Row className="w-nowrap">
                                <Col md={6}>Post: {client.name}</Col>
                                <Col md={10}>Date: {client.date}</Col>
                                <Col md={8}>
                                    Amount: {currencyFormat(client.total)}
                                </Col>
                            </Row>
                        </>
                    );
                });

                return _cb;
            }
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            render: (text, record) => {
                return currencyFormat(record.total);
            }
        }
    ];

    function onChangeTable(pagination, filters, sorter, extra) {
        let _subTotal = 0;
        extra.currentDataSource.map((record, key) => {
            _subTotal += record.total;
        });
        setSubTotal(_subTotal);
    }
    return (
        <Card>
            <Title level={4}>Cashbond</Title>
            <Row className="mb-10">
                <Col xs={0} md={20}></Col>
                <Col xs={0} md={4}>
                    <Select
                        style={{ width: "100%" }}
                        placeholder="Select Employee"
                        showSearch
                        onChange={e => setFilterEmployee(e)}
                    >
                        {employeeList &&
                            employeeList.map((employee, key) => {
                                return (
                                    <Select.Option
                                        value={employee.id}
                                        key={key}
                                    >
                                        {employee.name}
                                    </Select.Option>
                                );
                            })}
                    </Select>
                </Col>
            </Row>
            <Print>
                <Table
                    columns={columns}
                    dataSource={cashbonds}
                    onChange={onChangeTable}
                    pagination={{ pageSize: 50 }}
                />
                <div className="text-right">
                    <Title level={3}>Total: {subTotal}</Title>
                </div>
            </Print>
        </Card>
    );
};

export default TabReportsCashbond;
