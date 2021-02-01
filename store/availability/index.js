import {createStore} from "redux";
import {getInitialState} from "./initial-state";
import {reducer} from "./reducer.js";

export * from './actions.js';
export * from './selectors.js'

const store = createStore(reducer, getInitialState());

export default store;

