import React, { useState, useContext, useEffect } from "react";
import { Modal, Form, Row, Col, notification } from "antd";
import { fetchData } from "../../../../../../axios";
import { notificationErrors } from "../../../../../notificationErrors";
import FormEmployeeBasicInfo from "./formEmployeeBasicInfo";
import FormOtherInfo from "../../../pageClients/formOtherInfo";
import moment from "moment";
const ModalAddEditEmployee = ({
    showClientEmployeesModal,
    toggleShowAddEditClientEmployeesModal,
    _employeeInformation,
    getClientEmployees,
    client_id
}) => {
    const [formSaveLoading, setFormSaveLoading] = useState(false);
    const [employeeInformation, setEmployeeInformation] = useState({
        name: "",
        address: "",
        contact_number: "",
        birth_date: "",
        member_since: "",
        other_infos: []
    });

    const [otherInfos, setOtherInfos] = useState([]);

    let formAddEditEmployee;

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
    };

    const submitForm = e => {
        let data = e;
        data.member_since = data.member_since
            ? data.member_since.format("YYYY-MM-DD")
            : "";
        data.birth_date = data.birth_date
            ? data.birth_date.format("YYYY-MM-DD")
            : "";
        setFormSaveLoading(true);
        data["other_infos"] = otherInfos;
        data["id"] = _employeeInformation ? _employeeInformation.id : null;
        data["client_id"] = client_id;
        console.log(data);
        fetchData("POST", "api/employee", data)
            .then(res => {
                console.log(res);
                if (res.success) {
                    notification.success({
                        message: "Employee Saved Successfully"
                    });
                    setFormSaveLoading(false);
                    toggleShowAddEditClientEmployeesModal();
                    getClientEmployees();
                }
            })
            .catch(err => {
                console.log("error", err);
                setFormSaveLoading(false);
                notificationErrors(err);
            });
    };

    useEffect(() => {
        console.log("_employeeInformation", _employeeInformation);
        if (_employeeInformation) {
            _employeeInformation.member_since = _employeeInformation.member_since
                ? moment(_employeeInformation.member_since, "YYYY-MM-DD")
                : "";
            _employeeInformation.birth_date = _employeeInformation.birth_date
                ? moment(_employeeInformation.birth_date, "YYYY-MM-DD")
                : "";
            setEmployeeInformation({
                ...employeeInformation,
                ..._employeeInformation
            });
            setOtherInfos(_employeeInformation.other_infos);
        }
        return () => {};
    }, [_employeeInformation]);

    // useEffect(() => {
    //     console.log("employeeInformation", employeeInformation);
    //     return () => {};
    // }, [employeeInformation]);

    return (
        <Modal
            title="Employee Information"
            visible={showClientEmployeesModal}
            onOk={e => formAddEditEmployee.submit()}
            onCancel={toggleShowAddEditClientEmployeesModal}
            confirmLoading={formSaveLoading}
            width={"90%"}
            style={{ top: 20 }}
            okText="Save"
        >
            <Form
                {...layout}
                name="basic"
                onFinish={e => submitForm(e)}
                onFinishFailed={e => console.log(e)}
                ref={e => (formAddEditEmployee = e)}
                initialValues={employeeInformation}
            >
                <Row>
                    <Col xs={24} md={12}>
                        <FormEmployeeBasicInfo />
                    </Col>
                    <Col xs={24} md={12}>
                        <FormOtherInfo
                            otherInfos={otherInfos}
                            setOtherInfos={setOtherInfos}
                        />
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default ModalAddEditEmployee;
