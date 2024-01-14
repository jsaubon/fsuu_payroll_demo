import { Row } from "antd";
import React, { useEffect } from "react";
import CardClientInfo from "./cardClientInfo";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import ModalAddEditClient from "./modalAddEditClient";

const PageClientsDepartmentView = ({
    history,
    searchClient,
    sortClient,
    clientType,
    showModalAddEditClient,
    toggleShowModalAddEditClient
}) => {
    useEffect(() => {
        if (dataClients) {
            const delayDebounceFn = setTimeout(() => {
                console.log(searchClient);
                refetchClients();
            }, 1000);

            return () => clearTimeout(delayDebounceFn);
        }

        return () => {};
    }, [searchClient, sortClient, clientType]);

    const {
        data: dataClients,
        isLoading: isLoadingClients,
        refetch: refetchClients
    } = useAxiosQuery(
        "GET",
        "api/client?search=" +
            searchClient +
            "&sort=" +
            sortClient +
            "&type=" +
            clientType,
        "client_department_list",
        res => {
            console.log(res, "client_department_list");
        }
    );
    return (
        <>
            {isLoadingClients && <div>Loading...</div>}
            <Row style={{ marginLeft: "-10px", marginRight: "-10px" }}>
                {dataClients &&
                    dataClients.data.map((client, key) => {
                        return (
                            <CardClientInfo
                                history={history}
                                key={key}
                                client={client}
                            />
                        );
                    })}
            </Row>
            <ModalAddEditClient
                showModalAddEditClient={showModalAddEditClient}
                toggleShowModalAddEditClient={toggleShowModalAddEditClient}
            />
        </>
    );
};

export default PageClientsDepartmentView;
