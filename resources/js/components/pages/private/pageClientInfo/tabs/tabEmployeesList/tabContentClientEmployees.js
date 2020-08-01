import React, { useState, useEffect } from "react";
import { Row, Col, Button, Input, Table } from "antd";
import { fetchData } from "../../../../../../axios";
import { clientEmployeesTableColumns } from "./clientEmployeesTableColumns";
import ModalAddEditEmployee from "./modalAddEditEmployee";
import ModalDeductionsList from "./modalDeductionsList";

const TabContentClientEmployees = ({ client_id }) => {
    const [clientEmployees, setClientEmployees] = useState([]);
    const [showClientEmployeesModal, setShowClientEmployeesModal] = useState(
        false
    );
    const [employeeData, setEmployeeData] = useState();
    const [employeesTableSettings, setEmployeesTableSettings] = useState({
        size: 20,
        page: 1,
        search: "",
        order: "name",
        sort: "asc"
    });
    const getClientEmployees = () => {
        fetchData(
            "GET",
            "api/employee?client_id=" +
                client_id +
                "&search=" +
                employeesTableSettings.search +
                "&page=" +
                employeesTableSettings.page +
                "&size=" +
                employeesTableSettings.size +
                "&order=" +
                employeesTableSettings.order +
                "&sort=" +
                employeesTableSettings.sort
        ).then(res => {
            // console.log(res);
            setClientEmployees(res.data);
        });
    };

    const toggleShowAddEditClientEmployeesModal = record => {
        setShowClientEmployeesModal(!showClientEmployeesModal);
        if (record) {
            setEmployeeData(record);
        }
    };

    const handleOnPageChange = (page, pageSize) => {
        setEmployeesTableSettings({
            ...employeesTableSettings,
            page: page,
            size: pageSize
        });
    };
    const handleOnPageSizeChange = (page, pageSize) => {
        setEmployeesTableSettings({
            ...employeesTableSettings,
            page: page,
            size: pageSize
        });
    };

    const handleSearchEmployee = search => {
        setEmployeesTableSettings({
            ...employeesTableSettings,
            search: search
        });
    };

    useEffect(() => {
        getClientEmployees();
        return () => {};
    }, [employeesTableSettings]);

    const [showModalDeductionsList, setShowModalDeductionsList] = useState(
        false
    );
    const [selectedEmployee, setSelectedEmployee] = useState();
    const toggleShowModalDeductionsList = record => {
        setSelectedEmployee(record);
        setShowModalDeductionsList(!showModalDeductionsList);
    };

    return (
        <>
            <Row className="mb-10">
                <Col xs={24} md={18} className="px-0">
                    <Button
                        type="primary"
                        onClick={e => toggleShowAddEditClientEmployeesModal()}
                    >
                        New
                    </Button>
                </Col>
                <Col xs={24} md={6} className="px-0">
                    <div style={{ display: "flex" }}>
                        <Input.Search
                            placeholder="Search Employee"
                            onSearch={value => handleSearchEmployee(value)}
                            style={{ width: "100%" }}
                            className="pull-right"
                            onChange={e => handleSearchEmployee(e.target.value)}
                        />
                    </div>
                </Col>
            </Row>
            <Table
                dataSource={clientEmployees}
                columns={clientEmployeesTableColumns(
                    getClientEmployees,
                    toggleShowAddEditClientEmployeesModal,
                    toggleShowModalDeductionsList
                )}
                pagination={{
                    onChange: (page, pageSize) =>
                        handleOnPageChange(page, pageSize),
                    onShowSizeChange: (current, size) =>
                        handleOnPageSizeChange(current, size),
                    total: clientEmployees.length
                }}
                onChange={(pagination, filters, sorter) => {
                    setEmployeesTableSettings({
                        ...employeesTableSettings,
                        order: sorter.columnKey ? sorter.columnKey : "name",
                        sort: sorter.order
                            ? sorter.order.replace("end", "")
                            : "asc"
                    });
                }}
            />
            {showClientEmployeesModal && (
                <ModalAddEditEmployee
                    showClientEmployeesModal={showClientEmployeesModal}
                    toggleShowAddEditClientEmployeesModal={
                        toggleShowAddEditClientEmployeesModal
                    }
                    _employeeInformation={employeeData}
                    getClientEmployees={getClientEmployees}
                    client_id={client_id}
                />
            )}
            {showModalDeductionsList && (
                <ModalDeductionsList
                    showModalDeductionsList={showModalDeductionsList}
                    toggleShowModalDeductionsList={
                        toggleShowModalDeductionsList
                    }
                    employee={selectedEmployee}
                />
            )}
        </>
    );
};

export default TabContentClientEmployees;
