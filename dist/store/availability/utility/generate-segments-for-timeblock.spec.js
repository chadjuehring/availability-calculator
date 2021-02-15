"use strict";

var _set = _interopRequireDefault(require("date-fns/set"));

var _startOfDay = _interopRequireDefault(require("date-fns/startOfDay"));

var _generateSegmentsForTimeblock = require("./generate-segments-for-timeblock");

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
describe('generate-segments-for-timeblock utility function', () => {
  it('returns the 1 30-minute slot that exists between 9AM and 930AM', () => {
    const testTimeSlot = {
      startTime: today9AM,
      endTime: today930AM
    };
    const result = (0, _generateSegmentsForTimeblock.generateSegmentsForTimeBlock)(testTimeSlot, 30, 30);
    expect(result.length).toBe(1);
  });
  it('returns the 2 30-minute slots that exists between 9AM and 100AM', () => {
    const testTimeSlot = {
      startTime: today9AM,
      endTime: today10AM
    };
    const result = (0, _generateSegmentsForTimeblock.generateSegmentsForTimeBlock)(testTimeSlot, 30, 30);
    expect(result.length).toBe(2);
  });
  it('returns the 3 30-minute slots that exists between 9AM and 100AM with 15 minute start increment', () => {
    const testTimeSlot = {
      startTime: today9AM,
      endTime: today10AM
    };
    const result = (0, _generateSegmentsForTimeblock.generateSegmentsForTimeBlock)(testTimeSlot, 30, 15);
    expect(result.length).toBe(3);
  });
});