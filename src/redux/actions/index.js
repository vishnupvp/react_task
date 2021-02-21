import { UPDATE_LIST } from "../actionTypes";

export const updateOrders = (payload) => {
    return {
        type: UPDATE_LIST,
        payload
    }
}