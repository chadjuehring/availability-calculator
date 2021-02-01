import {createStore} from 'redux';
import set from 'date-fns/set';
import startOfToday from 'date-fns/startOfDay';
import {createAvailabilityBlock, createAvailabilitySlot, getAvailable, getAvailableFromTimeline} from './index';
import {reducer} from './reducer.js';
import {getInitialState} from './initial-state.js';

const midnight = startOfToday(new Date());
const today9AM = set(midnight, {hours: 9});
const today930AM = set(midnight, {hours: 9, minutes: 30});
const today10AM = set(midnight, {hours: 10});
const today1030AM = set(midnight, {hours: 10, minutes: 30});
const today11AM = set(midnight, {hours: 11});
const today1130AM = set(midnight, {hours: 11, minutes: 30});
const today12PM = set(midnight, {hours: 12});

describe('availability scheduler: first example', () => {
    const store = createStore(reducer, getInitialState())

    const newAvailabilityAction = createAvailabilitySlot(today9AM, today12PM);
    store.dispatch(newAvailabilityAction);
    const testState = store.getState();

    it('returns an array with correct amount of 30 min timeslots', () => {
        const timeslots = getAvailable(testState, 30, 30)
        expect(timeslots.length).toBe(6);
    });

    it('returns an array with correct amount of 60 min timeslots', () => {
        const timeslots = getAvailable(testState, 60, 30)
        expect(timeslots.length).toBe(5);
    });
})

describe.only('second example with availability blocks', () => {
    const store = createStore(reducer, getInitialState())

    const newAvailabilityAction = createAvailabilitySlot(today9AM, today12PM);
    store.dispatch(newAvailabilityAction);

    const firstBlock = createAvailabilityBlock(today930AM, today10AM);
    store.dispatch(firstBlock);

    const secondBlock = createAvailabilityBlock(today11AM, today1130AM);
    store.dispatch(secondBlock);

    const testState = store.getState();

    const rawblocks = getAvailableFromTimeline(testState.timeline, testState.availabilities.length, testState.blocked.length)
    console.log({ rawblocks });

    it('returns the 4 30 minute block that are possible', () => {
        const timeslots = getAvailable(testState, 30, 30);
        expect(timeslots.length).toBe(4);
    });

    it('returns the 1 60 minute block that is possible', () => {
        const timeslots = getAvailable(testState, 60, 30);
        expect(timeslots.length).toBe(1);
    });
});