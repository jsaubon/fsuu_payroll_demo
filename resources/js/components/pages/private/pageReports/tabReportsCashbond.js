import React, { useEffect, useState } from "react";
import { Card, Table, Row, Col, Select } from "antd";
import Title from "antd/lib/typography/Title";
import { fetchData } from "../../../../axios";
import { Print } from "react-easy-print";
import moment from "moment";

const TabReportsCashbond = () => {
    const [cashbonds, setCashbonds] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const [employeeList, setEmployeeList] = useState();
    const [filterEmployee, setFilterEmployee] = useState();
    const [tableColumns, setTableColumns] = useState([]);
    const [filterClients, setFilterClients] = useState([]);

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
                let _clientFilter = [];
                res.data.map((data, key) => {
                    data.client_employee_accountings.map((entry, k) => {
                        _subTotal += entry.amount;
                    });
                    // _clientFilter.push({
                    //     value: data.client.name,
                    //     text: data.client.name
                    // });
                });
                setSubTotal(_subTotal);
                setEmployeeList(res.employees);
                // setFilterClients(_clientFilter);
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

    const [filterYear, setFilterYear] = useState({
        from: 2018,
        to: 2020
    });

    const arrayColumn = (arr, n) => arr.map(x => x[n]);
    const arrSum = arr => arr.reduce((a, b) => a + b, 0);
    function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }

    useEffect(() => {
        let _columns = [
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
                    return record.client.name;
                }
                // onFilter: (value, record) =>
                //     record.client.name.indexOf(value) === 0,
                // filters: [...filterClients]
            }
        ];
        for (let year = filterYear.from; year <= filterYear.to; year++) {
            _columns.push({
                title: year,
                dataIndex: year,
                key: year,
                render: (text, record) => {
                    let _payroll = record.client_employee_accountings.filter(
                        p =>
                            parseInt(
                                moment(
                                    p.client_employee_payroll.client_payroll
                                        .date_start
                                ).format("YYYY")
                            ) == year
                    );

                    if (_payroll.length > 0) {
                        return formatNumber(
                            arrSum(arrayColumn(_payroll, "amount"))
                        );
                    }
                }
            });
        }

        setTableColumns(_columns);

        return () => {};
    }, [filterYear]);

    function onChangeTable(pagination, filters, sorter, extra) {
        let _subTotal = 0;
        extra.currentDataSource.map((record, key) => {
            record.client_employee_accountings.map((entry, k) => {
                _subTotal += entry.amount;
            });
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
            <Table
                columns={tableColumns}
                dataSource={cashbonds}
                onChange={onChangeTable}
                pagination={{ pageSize: 50 }}
            />
            <div className="text-right">
                <Title level={3}>Total: {subTotal}</Title>
            </div>
        </Card>
    );
};

export default TabReportsCashbond;
