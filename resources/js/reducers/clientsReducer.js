import { fetchData } from "../axios";

export default function ClientsReducer(state, action) {
    switch (action.type) {
        case "GET_CLIENTS":
            return {
                ...state,
                clients: action.payload
            };
        case "SAVE_CLIENTS":
            return {
                ...state,
                clients: action.payload
            };
        default:
            return state;
    }
}
