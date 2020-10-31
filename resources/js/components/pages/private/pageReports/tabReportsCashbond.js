import React, { useEffect, useState, useRef } from "react";
import { Card, Table, Row, Col, Select, Button, DatePicker } from "antd";
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
    const [yearRange, setYearRange] = useState({
        year_start: "",
        year_end: ""
    });
    const [monthRange, setMonthRange] = useState({
        month_start: "",
        year_start: ""
    });

    const getCashbond = () => {
        let url = "api/employee_assigned_post?report=1";
        if (filterEmployee) {
            url += "&employee=" + filterEmployee;
        }
        if (yearRange.year_start != "") {
            url += "&year_start=" + yearRange.year_start.format("YYYY");
            url += "&year_end=" + yearRange.year_end.format("YYYY");
        }
        if (monthRange.month_start != "") {
            url += "&month_start=" + monthRange.month_start.format("MM");
            url += "&month_end=" + monthRange.month_end.format("MM");
            url += "&year_start=" + monthRange.month_start.format("YYYY");
            url += "&year_end=" + monthRange.month_end.format("YYYY");
        }
        fetchData("GET", url).then(res => {
            if (res.success) {
                console.log(res);
                let _bonds = [];
                let _subTotal_ = 0;
                res.data.map((_data, key) => {

                    if(_data.bonds.length > 0) {
                        let _temp_total = 0;
                        _data.bonds.map((bond, index) => {
                            if (yearRange.year_start != "") { 
                                if(moment(bond.date_start).format('YYYY') >= yearRange.year_start.format("YYYY") && 
                                    moment(bond.date_start).format('YYYY') <= yearRange.year_end.format("YYYY")) {
                                    _temp_total += bond.total;
                                }
                            }

                            if(monthRange.month_start != "") {
                                if((moment(bond.date_start).format('YYYY') >= monthRange.month_start.format("YYYY") && 
                                    moment(bond.date_start).format('YYYY') <= monthRange.month_end.format("YYYY")) && 
                                    (moment(bond.date_start).format('MM') >= monthRange.month_start.format("MM") && 
                                    moment(bond.date_start).format('MM') <= monthRange.month_end.format("MM"))) {
                                    _temp_total += bond.total;
                                }
                            }
                        })
                        if(_temp_total > 0) {
                            _bonds.push(_data);
                            _subTotal_ += _temp_total;
                        }
                    }
                });
                setCashbonds(_bonds);
                let _employeeFilter = [];
                let _subTotal = 0;
                let _clientFilter = [];
                res.data.map((data, key) => {
                    data.bonds.map((entry, k) => {
                        if (yearRange.year_start != "") {
                            for (
                                let year = parseInt(
                                    moment(yearRange.year_start).format("YYYY")
                                );
                                year <=
                                parseInt(
                                    moment(yearRange.year_end).format("YYYY")
                                );
                                year++
                            ) {
                                if (
                                    parseInt(
                                        moment(entry.date_start).format("YYYY")
                                    ) == year
                                ) {
                                    _subTotal += entry.total;
                                }
                            }
                        } else if (monthRange.month_start != "") {
                            for (
                                let month = parseInt(
                                    moment(monthRange.month_start).format("MM")
                                );
                                month <=
                                parseInt(
                                    moment(monthRange.month_end).format("MM")
                                );
                                month++
                            ) {
                                if (
                                    parseInt(
                                        moment(entry.date_start).format("MM")
                                    ) == month
                                ) {
                                    _subTotal += entry.total;
                                }
                            }
                        } else {
                            _subTotal += entry.total;
                        }
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
        // getCashbond();
        return () => {};
    }, [filterEmployee]);

    const arrayColumn = (arr, n) => arr.map(x => x[n]);
    const arrSum = arr => arr.reduce((a, b) => a + b, 0);
    function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }

    let monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec"
    ];

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

        if (yearRange.year_start != "") {
            for (
                let year = parseInt(
                    moment(yearRange.year_start).format("YYYY")
                );
                year <= parseInt(moment(yearRange.year_end).format("YYYY"));
                year++
            ) {
                // let _subTotal_ = 0;
                _columns.push({
                    title: year,
                    dataIndex: year,
                    key: year,
                    render: (text, record) => {
                        let _payroll = record.bonds.filter(
                            p =>
                                parseInt(moment(p.date_start).format("YYYY")) ==
                                year
                        );

                        // console.log(_payroll);

                        if (_payroll.length > 0) {
                            // _subTotal_ += arrSum(arrayColumn(_payroll, "amount"));
                            // console.log("_subTotal_", _subTotal_);
                            // console.log(arrSum(arrayColumn(_payroll, "amount")));
                            // setSubTotal(
                            //     e => e + arrSum(arrayColumn(_payroll, "total"))
                            // );
                            return formatNumber(
                                arrSum(arrayColumn(_payroll, "total")) == 0
                                    ? ""
                                    : arrSum(arrayColumn(_payroll, "total"))
                            );
                        }
                    }
                });
            }
        }

        if (monthRange.month_start != "") {
            // let _subTotal_ = 0;
            for (
                let month = parseInt(
                    moment(monthRange.month_start).format("MM")
                );
                month <= parseInt(moment(monthRange.month_end).format("MM"));
                month++
            ) {
                let monthYear =
                    monthRange.month_start.format("YYYY") + "-" + month + "-01";
                let days = {
                    first_kensena: [1, 15],
                    second_kensena: [16, moment(monthYear).daysInMonth()]
                };
                Object.values(days).map((kensina, index) => {
                    _columns.push({
                        title:
                            monthNames[month - 1] +
                            " " +
                            kensina[0] +
                            "-" +
                            kensina[1],
                        dataIndex: month,
                        key: month,
                        render: (text, record) => {
                            let _payroll = record.bonds.filter(
                                p =>
                                    parseInt(
                                        moment(p.date_start).format("MM")
                                    ) == month &&
                                    parseInt(
                                        moment(p.date_start).format("DD")
                                    ) >= kensina[0] &&
                                    parseInt(
                                        moment(p.date_start).format("DD")
                                    ) <= kensina[1]
                            );

                            // console.log(_payroll);

                            if (_payroll.length > 0) {
                                // _subTotal_ += arrSum(
                                //     arrayColumn(_payroll, "amount")
                                // );
                                // console.log("_subTotal_", _subTotal_);
                                // console.log(arrSum(arrayColumn(_payroll, "amount")));
                                // setSubTotal(
                                //     e =>
                                //         e +
                                //         arrSum(arrayColumn(_payroll, "total"))
                                // );
                                return formatNumber(
                                    arrSum(arrayColumn(_payroll, "total")) == 0
                                        ? ""
                                        : arrSum(arrayColumn(_payroll, "total"))
                                );
                            }
                        }
                    });
                });
            }
            // console.log(_subTotal_);
        }

        setTableColumns(_columns);

        return () => {};
    }, [yearRange, filterClients]);
    useEffect(() => {
        if (yearRange.year_start != "") {
            getCashbond();
        }

        return () => {};
    }, [yearRange]);
    useEffect(() => {
        if (monthRange.month_start != "") {
            getCashbond();
        }

        return () => {};
    }, [monthRange]);

    function onChangeTable(pagination, filters, sorter, extra) {
        let _subTotal = 0;
        extra.currentDataSource.map((record, key) => {
            record.bonds.map((entry, k) => {
                // _subTotal += entry.total;
                // console.log(_subTotal, entry.total);
                if (yearRange.year_start != "") {
                    for (
                        let year = parseInt(
                            moment(yearRange.year_start).format("YYYY")
                        );
                        year <=
                        parseInt(moment(yearRange.year_end).format("YYYY"));
                        year++
                    ) {
                        if (
                            parseInt(moment(entry.date_start).format("YYYY")) ==
                            year
                        ) {
                            _subTotal += entry.total;
                        }
                    }
                } else if (monthRange.month_start != "") {
                    for (
                        let month = parseInt(
                            moment(monthRange.month_start).format("MM")
                        );
                        month <=
                        parseInt(moment(monthRange.month_end).format("MM"));
                        month++
                    ) {
                        if (
                            parseInt(moment(entry.date_start).format("MM")) ==
                            month
                        ) {
                            _subTotal += entry.total;
                        }
                    }
                } else {
                    _subTotal += entry.total;
                }
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
                <Col xs={0} md={16}></Col>
                <Col xs={0} md={8}>
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
                    <DatePicker.RangePicker
                        picker="year"
                        style={{ width: "100%" }}
                        onChange={e => {
                            setYearRange({ year_start: e[0], year_end: e[1] });
                            setMonthRange({
                                month_start: "",
                                month_end: "",
                                year_start: "",
                                year_end: ""
                            });
                        }}
                    />
                    <DatePicker.RangePicker
                        picker="month"
                        style={{ width: "100%" }}
                        onChange={e => {
                            setMonthRange({
                                month_start: e[0],
                                month_end: e[1]
                            });
                            setYearRange({
                                year_start: "",
                                year_end: ""
                            });
                        }}
                    />
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
