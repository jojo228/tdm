import { SET_ERRORS } from "../actions/types";
const isEmpty = require("is-empty");
const initialState = {
  errors: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ERRORS:
      return {
        ...state,
        errors: action.payload,
      };
    default:
      return state;
  }
}
