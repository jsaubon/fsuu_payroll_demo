import { Button, Table } from "antd";
import React, { useEffect, useState } from "react";
import ModalAddEditEmployee from "../pageClientInfo/tabs/tabEmployeesList/modalAddEditEmployee";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import ModalDeductionsList from "../pageClientInfo/tabs/tabEmployeesList/modalDeductionsList";

const PageClientsListView = ({
    history,
    searchClient,
    sortClient,
    clientType,
    showClientEmployeesModal,
    toggleShowAddEditClientEmployeesModal
}) => {
    const [employeesTableSettings, setEmployeesTableSettings] = useState({
        size: 20,
        page: 1,
        search: "",
        order: "name",
        sort: "asc"
    });

    useEffect(() => {
        if (dataEmployees) {
            const delayDebounceFn = setTimeout(() => {
                console.log(searchClient);
                refetchEmployees();
            }, 1000);
            return () => clearTimeout(delayDebounceFn);
        } else {
            return () => {};
        }
    }, [searchClient]);

    useEffect(() => {
        if (dataEmployees) {
            refetchEmployees();
        }

        return () => {};
    }, [employeesTableSettings]);
    const {
        data: dataEmployees,
        isLoading: isLoadingEmployees,
        refetch: refetchEmployees,
        isFetching: isFetchingEmployees
    } = useAxiosQuery(
        "GET",
        "api/employee?search=" +
            searchClient +
            "&type=" +
            clientType +
            "&page=" +
            employeesTableSettings.page +
            "&size=" +
            employeesTableSettings.size +
            "&order=" +
            employeesTableSettings.order +
            "&sort=" +
            employeesTableSettings.sort,
        "employees",
        res => {
            console.log(res, "123123");
        }
    );

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

    const [employeeData, setEmployeeData] = useState();
    const [client_id, setClientID] = useState();

    const [
        showClientEmployeesModalv2,
        setShowClientEmployeesModalv2
    ] = useState(false);

    const toggleShowAddEditClientEmployeesModalv2 = record => {
        if (record) {
            setEmployeeData(record);
            console.log(record);
        }
        setShowClientEmployeesModalv2(!showClientEmployeesModalv2);
    };

    const [showModalDeductionsList, setShowModalDeductionsList] = useState(
        false
    );
    const [selectedEmployee, setSelectedEmployee] = useState();
    const toggleShowModalDeductionsList = record => {
        setSelectedEmployee(record);
        setShowModalDeductionsList(!showModalDeductionsList);
    };
    return (
        <div style={{ marginTop: 10 }}>
            {isLoadingEmployees && <div>Loading...</div>}
            <Table
                dataSource={dataEmployees ? dataEmployees.data : []}
                loading={isLoadingEmployees || isFetchingEmployees}
                pagination={{
                    onChange: (page, pageSize) =>
                        handleOnPageChange(page, pageSize),
                    onShowSizeChange: (current, size) =>
                        handleOnPageSizeChange(current, size),
                    total: dataEmployees ? dataEmployees.data.length : 0
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
            >
                <Table.Column
                    title="Employee ID"
                    dataIndex="id"
                    key="id"
                    sorter={true}
                />
                <Table.Column
                    title="Name"
                    dataIndex="name"
                    key="name"
                    sorter={true}
                />
                <Table.Column
                    title="Email"
                    dataIndex="email"
                    key="email"
                    sorter={true}
                />
                <Table.Column
                    title="Phone"
                    dataIndex="phone"
                    key="phone"
                    sorter={true}
                />
                <Table.Column
                    title="Department"
                    dataIndex="department"
                    key="department"
                    sorter={true}
                    render={(text, record) => {
                        return record.client ? record.client.name : "";
                    }}
                />
                <Table.Column title="Status" dataIndex="status" key="status" />

                <Table.Column
                    title="Deductions"
                    dataIndex="deductions"
                    key="deductions"
                    sorter={true}
                    render={(text, record) => {
                        return (
                            <Button
                                type="primary"
                                onClick={e =>
                                    toggleShowModalDeductionsList(record)
                                }
                            >
                                Deductions
                            </Button>
                        );
                    }}
                />
                <Table.Column
                    title="View"
                    dataIndex="view"
                    key="view"
                    sorter={true}
                    render={(text, record) => {
                        return (
                            <Button
                                type="primary"
                                onClick={e =>
                                    toggleShowAddEditClientEmployeesModalv2(
                                        record
                                    )
                                }
                            >
                                View
                            </Button>
                        );
                    }}
                />
            </Table>
            {showClientEmployeesModal && (
                <ModalAddEditEmployee
                    showClientEmployeesModal={showClientEmployeesModal}
                    toggleShowAddEditClientEmployeesModal={
                        toggleShowAddEditClientEmployeesModal
                    }
                    _employeeInformation={employeeData}
                    getClientEmployees={refetchEmployees}
                    client_id={client_id}
                />
            )}

            {showClientEmployeesModalv2 && (
                <ModalAddEditEmployee
                    showClientEmployeesModal={showClientEmployeesModalv2}
                    toggleShowAddEditClientEmployeesModal={
                        toggleShowAddEditClientEmployeesModalv2
                    }
                    _employeeInformation={employeeData}
                    getClientEmployees={refetchEmployees}
                    client_id={employeeData ? employeeData.client.id : null}
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
        </div>
    );
};

export default PageClientsListView;
