import { fetchData } from "../../../../axios";

export const getClients = (
    dispatch,
    searchClient = "",
    sortClient = "asc",
    clientTyoe = ""
) => {
    fetchData(
        "GET",
        "api/client?search=" +
            searchClient +
            "&sort=" +
            sortClient +
            "&type=" +
            clientTyoe
    ).then(res => {
        if (res.success) {
            // console.log(res);
            dispatch({ type: "SAVE_CLIENTS", payload: res.data });
        }
    });
};
