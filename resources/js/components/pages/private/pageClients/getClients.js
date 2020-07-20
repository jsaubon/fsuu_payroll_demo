import { fetchData } from "../../../../axios";

export const getClients = (dispatch, searchClient = "", sortClient = "asc") => {
    fetchData(
        "GET",
        "api/client?search=" + searchClient + "&sort=" + sortClient
    ).then(res => {
        if (res.success) {
            // console.log(res);
            dispatch({ type: "SAVE_CLIENTS", payload: res.data });
        }
    });
};
