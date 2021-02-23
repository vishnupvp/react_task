import { UPDATE_LIST } from "../actionTypes";

const initialState = {
  list: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_LIST: {

      let list = [...action.payload, ...state.list.slice(0, 10)]

      // calculate chart value
      let max = list.reduce((acc, { amount }) => {
        if (amount > acc)
          acc = amount
        return acc;
      }, 0)

      list = list.map(({ amount, ...rest }) => {
        return {
          total: amount,
          amount,
          chartValue: amount / max,
          ...rest
        }
      })

      return {
        ...state,
        list,
      };
    }
    default:
      return state;
  }
}
