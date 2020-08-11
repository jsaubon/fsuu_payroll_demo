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
import FormItem from "antd/lib/form/FormItem";
import Text from "antd/lib/typography/Text";
import PrintProvider, { Print, NoPrint } from "react-easy-print";
import {
    UserOutlined,
    EyeOutlined,
    CaretLeftOutlined,
    PrinterOutlined,
    SaveOutlined
} from "@ant-design/icons";
import FormNewPayrollData from "./formNewPayrollData";
import { fetchData } from "../../../../axios";
import TblPayrollData from "./tblPayrollData";

const CardNewPayroll = () => {
    const [clientsList, setClientsList] = useState([]);
    const [clientInfo, setClientInfo] = useState();
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
        employeePayroll: []
    });

    const [accountingEntries, setAccountingEntries] = useState({
        debit: [],
        credit: []
    });

    const [showForm, setShowForm] = useState(true);

    const handleShowForm = () => {
        if (payrollDetails.client_id == "") {
            notification.error({ message: "Select Name of Client" });
            if (payrollDetails.date_start == "") {
                notification.error({ message: "Select Salary Period" });
            }
        } else if (payrollDetails.date_start == "") {
            notification.error({ message: "Select Salary Period" });
        } else {
            setShowForm(!showForm);
        }
    };

    const [savePayrollLoading, setSavePayrollLoading] = useState(false);
    const [payrollSaved, setPayrollSaved] = useState(false);
    const handleSavePayroll = () => {
        setSavePayrollLoading(true);
        fetchData("POST", "api/payroll", payrollDetails).then(res => {
            setSavePayrollLoading(false);
            if (res.success) {
                setPayrollSaved(true);
                notification.success({
                    message: "Payroll Saved Successfully!"
                });
            }
        });
    };

    return (
        <>
            <Card className="mt-10">
                <Print single={true} name="payroll" className="payrollPrint">
                    <div className="text-center">
                        <Title level={4} className="mb-0">
                            <i>
                                {clientInfo
                                    ? clientInfo.type == "Commando"
                                        ? "COMMANDO SECURITY SERVICE AGENCY, INC. (COMMANDO)"
                                        : "FIRST COMMANDO MANPOWER SERVICES"
                                    : ""}
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
                                                {client.name} - {client.type}
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

                    <FormNewPayrollData
                        setClientInfo={setClientInfo}
                        setPayrollDetails={setPayrollDetails}
                        payrollDetails={payrollDetails}
                        clientsList={clientsList}
                        accountingEntries={accountingEntries}
                        setAccountingEntries={setAccountingEntries}
                        showForm={showForm}
                    />

                    {payrollDetails.employeePayroll.length > 0 && (
                        <TblPayrollData
                            payrollDetails={payrollDetails}
                            accountingEntries={accountingEntries}
                            setPayrollDetails={setPayrollDetails}
                            showForm={showForm}
                        />
                    )}
                </Print>
                <NoPrint>
                    <div className="mt-10">
                        <Row>
                            <Col xs={12} md={3}>
                                <Button
                                    type="primary"
                                    block
                                    onClick={e => handleShowForm()}
                                >
                                    {showForm ? (
                                        <>
                                            <EyeOutlined /> Preview
                                        </>
                                    ) : (
                                        <>
                                            <CaretLeftOutlined /> Back
                                        </>
                                    )}
                                </Button>
                            </Col>
                            <Col xs={0} md={18}></Col>
                            <Col xs={12} md={3}>
                                {!payrollSaved && !showForm && (
                                    <Button
                                        icon={<SaveOutlined />}
                                        type="primary"
                                        danger
                                        block
                                        loading={savePayrollLoading}
                                        onClick={e => handleSavePayroll()}
                                    >
                                        Save
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    </div>
                </NoPrint>
            </Card>
        </>
    );
};

export default CardNewPayroll;
