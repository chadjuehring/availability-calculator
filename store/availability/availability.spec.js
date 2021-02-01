import set from 'date-fns/set';
import startOfToday from 'date-fns/startOfDay';
import {createAvailabilityBlock, createAvailabilitySlot, getAvailable} from './index';
import store from './index.js';

describe('availability scheduler: first example', () => {
    const startOfDay = startOfToday(new Date());
    const todayAt9am = set(startOfDay, {hours: 9});
    const todayAtNoon = set(startOfDay, {hours: 12});

    const newAvailabilityAction = createAvailabilitySlot(todayAt9am, todayAtNoon);
    store.dispatch(newAvailabilityAction);
    const testState = store.getState();

    console.log({testState})

    it('returns an array with correct amount of 30 min timeslots', () => {
        const timeslots = getAvailable(testState, 30)
        expect(timeslots.length).toBe(6);
    });

    it('returns an array with correct amount of 60 min timeslots', () => {
        const timeslots = getAvailable(testState, 30)
        expect(timeslots.length).toBe(5);
    });

})

// const newBlockAction = createAvailabilityBlock(Date.now(), Date.now())
// store.dispatch(newBlockAction);
