"use strict";

var _redux = require("redux");

var _set = _interopRequireDefault(require("date-fns/set"));

var _startOfDay = _interopRequireDefault(require("date-fns/startOfDay"));

var _addDays = _interopRequireDefault(require("date-fns/addDays"));

var _index = require("./index");

var _reducer = require("./reducer.js");

var _initialState = require("./initial-state.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const midnight = (0, _startOfDay.default)(new Date());
const today9AM = (0, _set.default)(midnight, {
  hours: 9
});
const today930AM = (0, _set.default)(midnight, {
  hours: 9,
  minutes: 30
});
const today10AM = (0, _set.default)(midnight, {
  hours: 10
});
const today1030AM = (0, _set.default)(midnight, {
  hours: 10,
  minutes: 30
});
const today11AM = (0, _set.default)(midnight, {
  hours: 11
});
const today1130AM = (0, _set.default)(midnight, {
  hours: 11,
  minutes: 30
});
const today12PM = (0, _set.default)(midnight, {
  hours: 12
});
const today5PM = (0, _set.default)(midnight, {
  hours: 17
});

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

describe('availability scheduler: first example', () => {
  const store = (0, _redux.createStore)(_reducer.reducer, (0, _initialState.getInitialState)());
  const newAvailabilityAction = (0, _index.createAvailabilitySlot)(today9AM, today12PM);
  store.dispatch(newAvailabilityAction);
  const testState = store.getState();
  it('returns an array with correct amount of 30 min timeslots', () => {
    const timeslots = (0, _index.getAvailable)(testState, 30, 30);
    expect(timeslots.length).toBe(6);
  });
  it('returns an array with correct amount of 60 min timeslots', () => {
    const timeslots = (0, _index.getAvailable)(testState, 60, 30);
    expect(timeslots.length).toBe(5);
  });
});
describe('getAvailableFromTimeline', () => {
  const store = (0, _redux.createStore)(_reducer.reducer, (0, _initialState.getInitialState)());
  const newAvailabilityAction = (0, _index.createAvailabilitySlot)(today9AM, today12PM);
  store.dispatch(newAvailabilityAction);
  const secondBlock = (0, _index.createAvailabilityBlock)(today11AM, today1130AM);
  store.dispatch(secondBlock);
  const firstBlock = (0, _index.createAvailabilityBlock)(today930AM, today10AM);
  store.dispatch(firstBlock);
  const testState = store.getState();
  const rawblocks = (0, _index.getAvailableFromTimeline)(testState.timeline, testState.availabilities.length, testState.blocked.length);
  it('gets all the solid blocks of time between the blocks', () => {
    expect(rawblocks.length).toBe(3);
  });
});
describe('second example with availability blocks', () => {
  const store = (0, _redux.createStore)(_reducer.reducer, (0, _initialState.getInitialState)());
  const newAvailabilityAction = (0, _index.createAvailabilitySlot)(today9AM, today12PM);
  store.dispatch(newAvailabilityAction);
  const firstBlock = (0, _index.createAvailabilityBlock)(today930AM, today10AM);
  store.dispatch(firstBlock);
  const secondBlock = (0, _index.createAvailabilityBlock)(today11AM, today1130AM);
  store.dispatch(secondBlock);
  const testState = store.getState();
  it('returns the 4 30 minute block that are possible', () => {
    const timeslots = (0, _index.getAvailable)(testState, 30, 30);
    expect(timeslots.length).toBe(4);
  });
  it('returns the 1 60 minute block that is possible', () => {
    const timeslots = (0, _index.getAvailable)(testState, 60, 30);
    expect(timeslots.length).toBe(1);
  });
});
describe('does not take until the heatdeath of the universe to run with 4 weeks worth of realistic-ish content', () => {
  const store = (0, _redux.createStore)(_reducer.reducer, (0, _initialState.getInitialState)());
  const fourWeeksEmpty = new Array(4 * 7).fill(null);
  const fourWeeksAvailability = fourWeeksEmpty.map((val, index) => {
    const day = (0, _addDays.default)(midnight, index);
    return {
      startTime: (0, _set.default)(day, {
        hours: 8
      }),
      endTime: (0, _set.default)(day, {
        hours: 12
      })
    };
  });
  const fourWeeksAvailabilityAfternoon = fourWeeksEmpty.map((val, index) => {
    const day = (0, _addDays.default)(midnight, index);
    return {
      startTime: (0, _set.default)(day, {
        hours: 13,
        minutes: 30
      }),
      endTime: (0, _set.default)(day, {
        hours: 17
      })
    };
  });
  const fourWeeksBlocked = fourWeeksEmpty.map((val, index) => {
    const day = (0, _addDays.default)(midnight, index);
    const blocks = randomNumber(0, 4);
    return new Array(blocks).fill(null).map((v, idx) => {
      return {
        startTime: (0, _set.default)(day, {
          hours: 8
        }),
        endTime: (0, _set.default)(day, {
          hours: 17
        })
      };
    });
  }).reduce((acc = [], next) => acc.concat(...next));
  const availables = [...fourWeeksAvailability, ...fourWeeksAvailabilityAfternoon];
  const blocks = fourWeeksBlocked;
  availables.forEach(availablility => {
    store.dispatch((0, _index.createAvailabilitySlot)(availablility.startTime, availablility.endTime));
  });
  blocks.forEach(block => {
    store.dispatch((0, _index.createAvailabilityBlock)(block.startTime, block.endTime));
  });
  const slots = (0, _index.getAvailable)(store.getState(), 30, 30);
  expect(slots).toBeTruthy();
});