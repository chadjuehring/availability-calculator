import {createStore} from 'redux';
import set from 'date-fns/set';
import startOfToday from 'date-fns/startOfDay';
import addDays from 'date-fns/addDays';
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
const today5PM = set(midnight, {hours: 17});

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

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

describe('getAvailableFromTimeline', () => {
    const store = createStore(reducer, getInitialState())

    const newAvailabilityAction = createAvailabilitySlot(today9AM, today12PM);
    store.dispatch(newAvailabilityAction);

    const secondBlock = createAvailabilityBlock(today11AM, today1130AM);
    store.dispatch(secondBlock);

    const firstBlock = createAvailabilityBlock(today930AM, today10AM);
    store.dispatch(firstBlock);

    const testState = store.getState();

    const rawblocks = getAvailableFromTimeline(testState.timeline, testState.availabilities.length, testState.blocked.length)

    it('gets all the solid blocks of time between the blocks', () => {
        expect(rawblocks.length).toBe(3);
    });
})

describe('second example with availability blocks', () => {
    const store = createStore(reducer, getInitialState())

    const newAvailabilityAction = createAvailabilitySlot(today9AM, today12PM);
    store.dispatch(newAvailabilityAction);

    const firstBlock = createAvailabilityBlock(today930AM, today10AM);
    store.dispatch(firstBlock);

    const secondBlock = createAvailabilityBlock(today11AM, today1130AM);
    store.dispatch(secondBlock);

    const testState = store.getState();

    it('returns the 4 30 minute block that are possible', () => {
        const timeslots = getAvailable(testState, 30, 30);
        expect(timeslots.length).toBe(4);
    });

    it('returns the 1 60 minute block that is possible', () => {
        const timeslots = getAvailable(testState, 60, 30);
        expect(timeslots.length).toBe(1);
    });
});

describe('does not take until the heatdeath of the universe to run with 4 weeks worth of realistic-ish content', () => {
    const store = createStore(reducer, getInitialState())

    const fourWeeksEmpty = new Array(4 * 7).fill(null)
    const fourWeeksAvailability = fourWeeksEmpty
        .map((val, index) => {
            const day = addDays(midnight, index);
            return {
                startTime: set(day, {hours: 8}),
                endTime: set(day, {hours: 12}),
            }
        })

    const fourWeeksAvailabilityAfternoon = fourWeeksEmpty
        .map((val, index) => {
            const day = addDays(midnight, index);
            return {
                startTime: set(day, {hours: 13, minutes: 30}),
                endTime: set(day, {hours: 17}),
            }
        })

    const fourWeeksBlocked = fourWeeksEmpty
        .map((val, index) => {
            const day = addDays(midnight, index);

            const blocks = randomNumber(0, 4);

            return new Array(blocks).fill(null)
                .map((v, idx) => {
                    return {
                        startTime: set(day, {hours: 8}),
                        endTime: set(day, {hours: 17}),
                    };
                })
        }).reduce((acc = [], next) => acc.concat(...next))

    const availables = [...fourWeeksAvailability, ...fourWeeksAvailabilityAfternoon];
    const blocks = fourWeeksBlocked;

    availables.forEach(availablility => {
        store.dispatch(createAvailabilitySlot(availablility.startTime, availablility.endTime));
    })

    blocks.forEach(block => {
        store.dispatch(createAvailabilityBlock(block.startTime, block.endTime));
    })

    const slots = getAvailable(store.getState(), 30, 30);
    expect(slots).toBeTruthy();
})