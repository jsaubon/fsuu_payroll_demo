import React, { useState, useEffect } from "react";
import {
    Modal,
    Form,
    Input,
    Upload,
    Row,
    Col,
    Anchor,
    Button,
    DatePicker,
    notification
} from "antd";
import {
    LoadingOutlined,
    PlusOutlined,
    PlayCircleOutlined,
    PlusCircleOutlined
} from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import moment from "moment";
import { fetchData } from "../../../../axios";
import { notificationErrors } from "../../../notificationErrors";
import FormBasicInfo from "./formBasicInfo";
import UploadClientLogo from "./uploadClientLogo";
import FormOtherInfo from "./formOtherInfo";

const ModalAddEditClient = ({
    showModalAddEditClient,
    toggleShowModalAddEditClient
}) => {
    const [formSaveLoading, setFormSaveLoading] = useState(false);
    const [clientInformation, setClientInformation] = useState({
        name: "",
        address: "",
        photo: undefined,
        contact_number: "",
        client_since: ""
    });
    const [otherInfos, setOtherInfos] = useState([
        {
            title: "",
            description: ""
        }
    ]);

    let formAddEditClient;

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
    };

    const submitForm = e => {
        let data = e;
        data.client_since = data.client_since
            ? data.client_since.format("YYYY-MM-DD")
            : "";
        setFormSaveLoading(true);
        data["photo"] = clientInformation.photo;
        data["other_infos"] = otherInfos;
        fetchData("POST", "api/client", data)
            .then(res => {
                console.log(res);
                if (res.success) {
                    notification.success({
                        message: "Client Saved Successfully"
                    });
                    setFormSaveLoading(false);
                }
            })
            .catch(err => {
                setFormSaveLoading(false);
                notificationErrors(err);
            });
    };

    return (
        <Modal
            title="Client Information"
            visible={showModalAddEditClient}
            onOk={e => formAddEditClient.submit()}
            onCancel={toggleShowModalAddEditClient}
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
                ref={e => (formAddEditClient = e)}
                initialValues={clientInformation}
            >
                <Row>
                    <Col xs={24} md={4}>
                        <UploadClientLogo
                            setClientInformation={setClientInformation}
                        />
                    </Col>
                    <Col xs={24} md={8}>
                        <FormBasicInfo />
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

export default ModalAddEditClient;
