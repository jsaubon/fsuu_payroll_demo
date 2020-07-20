import React from "react";
import { Col, Card } from "antd";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import { PhoneOutlined, CalendarOutlined } from "@ant-design/icons";
import moment from "moment";

const CardClientInfo = ({ history, client }) => {
    const goToClient = id => {
        history.push("/clients/" + id);
    };
    return (
        <>
            <Col xs={24} md={4} className="p-10 mt-10">
                <Card
                    hoverable
                    onClick={e => goToClient(client.id)}
                    cover={
                        <img
                            alt="example"
                            src={`${location.origin}/${client.photo}`}
                            height={170}
                        />
                    }
                >
                    {/* <Meta
                                        title={client.name}
                                        description={`${client.address} <br/> ${client.contact_number}`}
                                    /> */}
                    <Title level={4}>{client.name}</Title>
                    {client.address && (
                        <>
                            <Text>{client.address}</Text>
                            <br></br>
                        </>
                    )}

                    {client.contact_number && (
                        <>
                            <Text>
                                <PhoneOutlined /> {client.contact_number}
                            </Text>
                            <br></br>
                        </>
                    )}
                    {client.client_since && (
                        <Text>
                            <CalendarOutlined />{" "}
                            {moment(client.client_since).format("YYYY-MM-DD")}
                        </Text>
                    )}
                </Card>
            </Col>
        </>
    );
};

export default CardClientInfo;
