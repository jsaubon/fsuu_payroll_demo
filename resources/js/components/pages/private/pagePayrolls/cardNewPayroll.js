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
    Button
} from "antd";
import FormItem from "antd/lib/form/FormItem";
import Text from "antd/lib/typography/Text";
import PrintProvider, { Print, NoPrint } from "react-easy-print";
import { UserOutlined } from "@ant-design/icons";
import FormNewPayrollData from "./formNewPayrollData";
import { fetchData } from "../../../../axios";

const CardNewPayroll = () => {
    const [clientsList, setClientsList] = useState([]);
    useEffect(() => {
        fetchData("GET", "api/client?sort=asc").then(res => {
            // console.log(res);
            if (res.success) {
                setClientsList(res.data);
            }
        });
        return () => {};
    }, []);
    const [payrollDetails, setPayrollDetails] = useState({
        client_id: "",
        date_start: "",
        date_end: "",
        employeeList: []
    });

    useEffect(() => {
        console.log(payrollDetails);
        return () => {};
    }, [payrollDetails]);

    return (
        <>
            <Card className="mt-10">
                <Print single={true} name="payroll">
                    <div className="text-center">
                        <Title level={4} className="mb-0">
                            <i>
                                COMMANDO SECURITY SERVICE AGENCY, INC.
                                (COMMANDO)
                            </i>
                        </Title>
                        <Text>
                            <i>
                                BUTUAN MAIN OFFICE
                                <br />
                                126 T. Calo Ext., 8600 Butuan City
                                <br />
                                Tel. No. (085) 342-8283 and (085) 341-3214
                            </i>
                        </Text>
                    </div>
                    <Row>
                        <Col xs={24} md={12} className="text-center">
                            <div className="ant-form-item-label">
                                <label>NAME OF CLIENT </label>
                                <Select
                                    className="select-br-b-only"
                                    name="client_id"
                                    style={{
                                        width: 200
                                    }}
                                    allowClear
                                    showSearch
                                    showArrow={false}
                                    // value={payrollDetails.nameOfClient}
                                    onChange={e =>
                                        setPayrollDetails({
                                            ...payrollDetails,
                                            client_id: clientsList.find(
                                                p => p.name == e
                                            ).id
                                        })
                                    }
                                >
                                    {clientsList.map((client, key) => {
                                        return (
                                            <Select.Option
                                                key={key}
                                                value={client.name}
                                            >
                                                {client.name}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </div>
                        </Col>
                        <Col xs={24} md={12} className="text-center">
                            <div className="ant-form-item-label">
                                <label>SALARY PERIOD </label>
                                <DatePicker.RangePicker
                                    style={{
                                        width: 250,
                                        borderTop: 0,
                                        borderLeft: 0,
                                        borderRight: 0
                                    }}
                                    onChange={e =>
                                        setPayrollDetails({
                                            ...payrollDetails,
                                            date_start: e[0].format(
                                                "YYYY-MM-DD"
                                            ),
                                            date_end: e[1].format("YYYY-MM-DD")
                                        })
                                    }
                                    format="YYYY-MM-DD"
                                    separator="to"
                                />
                            </div>
                        </Col>
                    </Row>
                    <Card className="mt-10">
                        <FormNewPayrollData
                            setPayrollDetails={setPayrollDetails}
                            payrollDetails={payrollDetails}
                            clientsList={clientsList}
                        />
                    </Card>
                    <div className="ant-table ant-table-bordered">
                        <div className="ant-table-container">
                            <div className="ant-table-content">
                                <table style={{ tableLayout: "auto" }}>
                                    <thead className="ant-table-thead">
                                        <tr>
                                            <th className="ant-table-cell"></th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>
                    </div>
                </Print>
            </Card>
        </>
    );
};

export default CardNewPayroll;
