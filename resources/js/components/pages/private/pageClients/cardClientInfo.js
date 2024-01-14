import React from "react";
import { Col, Card } from "antd";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import { PhoneOutlined, CalendarOutlined } from "@ant-design/icons";
import moment from "moment";
import Paragraph from "antd/lib/typography/Paragraph";

const CardClientInfo = ({ history, client }) => {
    const goToClient = id => {
        history.push("/employees/" + id);
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
                    <Title level={4}>{client.name}</Title>
                    <Paragraph
                        ellipsis={{
                            rows: 1
                        }}
                        title={`${client.address}`}
                        className="mb-0"
                    >
                        {client.address || "-"}
                    </Paragraph>
                    <Text>
                        <PhoneOutlined /> {client.contact_number || "-"}
                    </Text>
                    <br></br>
                    <Text>
                        <CalendarOutlined />{" "}
                        {client.client_since
                            ? moment(client.client_since).format("YYYY-MM-DD")
                            : "-"}
                    </Text>
                </Card>
            </Col>
        </>
    );
};

export default CardClientInfo;
