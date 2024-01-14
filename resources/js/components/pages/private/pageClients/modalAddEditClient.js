import React, { useState, useContext, useEffect } from "react";
import { Modal, Form, Row, Col, notification } from "antd";
import { fetchData } from "../../../../axios";
import { notificationErrors } from "../../../notificationErrors";
import FormBasicInfo from "./formClientBasicInfo";
import UploadClientLogo from "./uploadClientLogo";
import FormOtherInfo from "./formOtherInfo";
import ClientsContext from "../../../../contexts/clientsContext";
import { getClients } from "./getClients";
import moment from "moment";
const ModalAddEditClient = ({
    showModalAddEditClient,
    toggleShowModalAddEditClient,
    _clientInformation
}) => {
    const [formSaveLoading, setFormSaveLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const [clientInformation, setClientInformation] = useState({
        name: "",
        address: "",
        photo: undefined,
        contact_number: "",
        client_since: ""
    });
    const [otherInfos, setOtherInfos] = useState([]);
    const { dispatchClients } = useContext(ClientsContext);

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
        data["id"] = _clientInformation ? _clientInformation.id : null;
        fetchData("POST", "api/client", data)
            .then(res => {
                // console.log(res);
                if (res.success) {
                    notification.success({
                        message: "Client Saved Successfully"
                    });
                    setFormSaveLoading(false);
                    toggleShowModalAddEditClient();
                    getClients(dispatchClients);
                }
            })
            .catch(err => {
                setFormSaveLoading(false);
                notificationErrors(err);
            });
    };

    useEffect(() => {
        // console.log(_clientInformation);
        if (_clientInformation) {
            _clientInformation.client_since = _clientInformation.client_since
                ? moment(_clientInformation.client_since, "YYYY-MM-DD")
                : "";
            setClientInformation(_clientInformation);
            setOtherInfos(_clientInformation.other_infos);
            setImageUrl(_clientInformation.photo);
        }
        return () => {};
    }, [_clientInformation]);

    return (
        <Modal
            title="Department Information"
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
                            imageUrl={imageUrl}
                            setImageUrl={setImageUrl}
                        />
                    </Col>
                    <Col xs={24} md={10}>
                        <FormBasicInfo />
                    </Col>
                    <Col xs={24} md={10}>
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
