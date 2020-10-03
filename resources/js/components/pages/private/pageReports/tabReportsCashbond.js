import React, { useEffect, useState, useRef } from "react";
import { Card, Table, Row, Col, Select, Button } from "antd";
import Title from "antd/lib/typography/Title";
import { fetchData } from "../../../../axios";
import { Print } from "react-easy-print";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import { currencyFormat } from "../../../currencyFormat";
import Text from "antd/lib/typography/Text";

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
                        // console.log(_subTotal, entry.amount, data.name);
                    });

                    let exist = _clientFilter.find(
                        p => p.value == data.client.name
                    );
                    if (!exist) {
                        _clientFilter.push({
                            value: data.client.name,
                            text: data.client.name
                        });
                    }
                });
                setSubTotal(_subTotal);
                setEmployeeList(res.employees);
                setFilterClients(_clientFilter);
            }
        });
    };

    useEffect(() => {
        getCashbond();
        return () => {};
    }, [filterEmployee]);

    const [filterYear, setFilterYear] = useState({
        from: 2018,
        to: parseInt(moment().format("YYYY"))
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
                },
                onFilter: (value, record) =>
                    record.client.name.indexOf(value) === 0,
                sorter: (a, b) => a.client.name.length - b.client.name.length,
                sortDirections: ["descend", "ascend"],
                filters: [...filterClients]
            }
        ];

        for (let year = filterYear.from; year <= filterYear.to; year++) {
            // let _subTotal_ = 0;
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

                    // console.log(_payroll);

                    if (_payroll.length > 0) {
                        // _subTotal_ += arrSum(arrayColumn(_payroll, "amount"));
                        // console.log("_subTotal_", _subTotal_);
                        // console.log(arrSum(arrayColumn(_payroll, "amount")));
                        return formatNumber(
                            arrSum(arrayColumn(_payroll, "amount"))
                        );
                    }
                }
            });
        }

        setTableColumns(_columns);

        return () => {};
    }, [filterYear, filterClients]);

    function onChangeTable(pagination, filters, sorter, extra) {
        let _subTotal = 0;
        extra.currentDataSource.map((record, key) => {
            record.client_employee_accountings.map((entry, k) => {
                _subTotal += entry.amount;
                console.log(_subTotal, entry.amount);
            });
        });
        setSubTotal(_subTotal);
    }

    const componentRef = useRef();

    const handlePrintPayroll = useReactToPrint({
        content: () => componentRef.current
    });
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
            <div ref={componentRef}>
                <div className="text-center">
                    <Text>
                        <Select
                            style={{
                                width: "100%",
                                textAlign: "center",
                                fontSize: 20,
                                fontStyle: "italic",
                                border: "none"
                            }}
                            className="select-no-border"
                            defaultValue="COMMANDO SECURITY SERVICE AGENCY, INC.
                            (COMMANDO)"
                        >
                            <Select.Option
                                value="COMMANDO SECURITY SERVICE AGENCY, INC.
                                (COMMANDO)"
                            >
                                COMMANDO SECURITY SERVICE AGENCY, INC.
                                (COMMANDO)
                            </Select.Option>
                            <Select.Option value="FIRST COMMANDO MANPOWER SERVICES">
                                FIRST COMMANDO MANPOWER SERVICES
                            </Select.Option>
                        </Select>
                        <br></br>
                        <i>
                            BUTUAN MAIN OFFICE
                            <br />
                            126 T. Calo Ext., 8600 Butuan City
                            <br />
                            Tel. No. (085) 342-8283 and (085) 341-3214
                        </i>
                    </Text>

                    <Title level={4} className="mb-0">
                        Cashbond Report
                    </Title>
                </div>
                <br />
                <Table
                    columns={tableColumns}
                    dataSource={cashbonds}
                    onChange={onChangeTable}
                    pagination={false}
                    size="small"
                />
                <div className="text-right">
                    <Title level={3}>Total: {currencyFormat(subTotal)}</Title>
                </div>
            </div>

            <div className="text-right mt-10">
                <Button type="primary" onClick={e => handlePrintPayroll()}>
                    Print
                </Button>
            </div>
        </Card>
    );
};

export default TabReportsCashbond;
