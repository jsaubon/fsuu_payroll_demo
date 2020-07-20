import React, { useState, useEffect } from "react";
import Text from "antd/lib/typography/Text";
import { Button, Form, Space, Input, Row, Col } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

const FormOtherInfo = ({ otherInfos, setOtherInfos }) => {
    const addOtherInfo = () => {
        setOtherInfos([
            ...otherInfos,
            {
                title: "",
                description: ""
            }
        ]);
    };

    const removeOtherInfo = key => {
        let _otherInfos = [...otherInfos];
        _otherInfos.splice(key, 1);
        setOtherInfos([..._otherInfos]);
    };

    const updateData = (key, field, value) => {
        let _otherInfos = [...otherInfos];
        _otherInfos[key][field] = value;
        setOtherInfos([..._otherInfos]);
    };

    useEffect(() => {
        // console.log(otherInfos);
        return () => {};
    }, [otherInfos]);

    return (
        <>
            <Text>
                Other Information{" "}
                <Button
                    size="small"
                    type="link"
                    shape="circle"
                    icon={<PlusCircleOutlined />}
                    onClick={e => addOtherInfo()}
                />
            </Text>
            {otherInfos.length > 0 &&
                otherInfos.map((otherInfo, key) => {
                    return (
                        <Row
                            key={key}
                            className={key != 0 ? "mt-15" : ""}
                            style={{
                                marginTop: key == 0 && "-2px"
                            }}
                        >
                            <Col xs={24} md={10} className="px-0">
                                <Input
                                    placeholder="Title"
                                    value={otherInfo.title}
                                    onChange={e =>
                                        updateData(key, "title", e.target.value)
                                    }
                                />
                            </Col>
                            <Col xs={24} md={10}>
                                <Input
                                    placeholder="Description"
                                    value={otherInfo.description}
                                    onChange={e =>
                                        updateData(
                                            key,
                                            "description",
                                            e.target.value
                                        )
                                    }
                                />
                            </Col>
                            <Col xs={24} md={4}>
                                <Button
                                    block
                                    type="primary"
                                    danger
                                    onClick={e => removeOtherInfo(key)}
                                >
                                    -
                                </Button>
                            </Col>
                        </Row>
                    );
                })}
        </>
    );
};

export default FormOtherInfo;
