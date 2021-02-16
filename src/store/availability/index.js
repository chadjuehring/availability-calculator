import parseIso from 'date-fns/parseISO';
import {createStore} from "redux";
import {getInitialState} from "./initial-state";
import {reducer} from "./reducer.js";
import {createAvailabilityBlock, createAvailabilitySlot} from "./actions";
import {getAvailable} from "./selectors";

export * from './actions.js';
export * from './selectors.js'

const store = createStore(reducer, getInitialState());

export default store;

// OOP interface for those that might want it
export class AvailabilityCalculator {
    constructor() {
        this.store = createStore(reducer, getInitialState());
    }

    addAvailability(startDate, endDate) {
        this.store.dispatch(createAvailabilitySlot(parseIso(startDate), parseIso(endDate)));
    }

    addBlock(startDate, endDate) {
        this.store.dispatch(createAvailabilityBlock(parseIso(startDate), parseIso(endDate)));
    }

    getAvailability(timeSlotLengthMinutes, incrementsOnTheHour) {
        return getAvailable(this.store.getState(), timeSlotLengthMinutes, incrementsOnTheHour);
    }
}