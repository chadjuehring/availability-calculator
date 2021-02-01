import isBefore from 'date-fns/isBefore';
import {getInitialState} from "./initial-state";
import * as types from "./types";

export function createUnifiedTimeline(available = [], blocked = []) {
    const startAvailable = available.map((slot, index) => ({isAvailable: true, time: slot.startDate, index, availableBlock: true}));
    const endAvailable = available.map((slot, index) => ({isAvailable: false, time: slot.endDate, index, availableBlock: true}));

    const startBlocked = blocked.map((slot, index) => ({isAvailable: false, time: slot.startDate, index, availableBlock: false}));
    const end = blocked.map((slot, index) => ({isAvailable: true, time: slot.endDate, index, availableBlock: false}));
    return [...startAvailable, ...endAvailable, ...startBlocked, ...end].sort((a, b) => isBefore(a.time, b.time) ? -1 : 1);
}

export function reducer(prevState = getInitialState(), action) {
    switch (action.type) {
        case types.CREATE_AVAILABILITY_SLOT:
            const nextAvailabilities = [...prevState.availabilities, {...action.payload}]
            return {
                ...prevState,
                availabilities: nextAvailabilities,
                timeline: createUnifiedTimeline(nextAvailabilities, prevState.blocked),
            };
        case types.CREATE_AVAILABILITY_BLOCK:
            const nextBlocked = [...prevState.blocked, {...action.payload}];
            return {
                ...prevState,
                blocked: nextBlocked,
                timeline: createUnifiedTimeline(prevState.availabilities, prevState.blocked),
            }
        default:
            return prevState;
    }

}