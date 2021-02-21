import { UPDATE_LIST } from "../actionTypes";

const initialState = {
    list: []
  };

export default function(state = initialState, action) {
    switch (action.type) {
      case UPDATE_LIST: {
        return {
          ...state,
          list: [...action.payload, ...state.list.slice(0, 70)],
        };
      }
      default:
        return state;
    }
  }
  