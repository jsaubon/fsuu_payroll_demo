import React, { useState, useEffect } from "react";
import { Card, Row, Col, Select, InputNumber } from "antd";
import Text from "antd/lib/typography/Text";
import moment from "moment";

const CardPayrollList = () => {
    const [pageFilters, setPageFilters] = useState({
        month: parseInt(moment().format("M")),
        year: parseInt(moment().format("YYYY"))
    });

    useEffect(() => {
        console.log(pageFilters);
        return () => {};
    }, [pageFilters]);
    return (
        <Card className="mt-10">
            <Row>
                <Col xs={24} md={18}></Col>
                <Col xs={24} md={6}>
                    <div style={{ display: "flex" }}>
                        <Text style={{ lineHeight: "2.2", paddingRight: 10 }}>
                            Filters
                        </Text>
                        <Select
                            placeholder="Select Month"
                            style={{ width: "-webkit-fill-available" }}
                            value={pageFilters.month}
                            onChange={e =>
                                setPageFilters({
                                    ...pageFilters,
                                    month: parseInt(e)
                                })
                            }
                        >
                            <Select.Option value={1}>January</Select.Option>
                            <Select.Option value={2}>February</Select.Option>
                            <Select.Option value={3}>March</Select.Option>
                            <Select.Option value={4}>April</Select.Option>
                            <Select.Option value={5}>May</Select.Option>
                            <Select.Option value={6}>June</Select.Option>
                            <Select.Option value={7}>July</Select.Option>
                            <Select.Option value={8}>August</Select.Option>
                            <Select.Option value={9}>September</Select.Option>
                            <Select.Option value={10}>October</Select.Option>
                            <Select.Option value={11}>November</Select.Option>
                            <Select.Option value={12}>December</Select.Option>
                        </Select>
                        <InputNumber
                            style={{ width: 140 }}
                            value={pageFilters.year}
                            onChange={e =>
                                setPageFilters({
                                    ...pageFilters,
                                    year: parseInt(e)
                                })
                            }
                        />
                    </div>
                </Col>
            </Row>
        </Card>
    );
};

export default CardPayrollList;
