"use strict";

var _set = _interopRequireDefault(require("date-fns/set"));

var _startOfDay = _interopRequireDefault(require("date-fns/startOfDay"));

var _isBefore = _interopRequireDefault(require("date-fns/isBefore"));

var _reducer = require("./reducer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('create unified timeline', () => {
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
  describe('create timeline with no blocks', () => {
    const testAvailability = [{
      startDate: today9AM,
      endDate: today12PM
    }];
    const result = (0, _reducer.createUnifiedTimeline)(testAvailability, []);
    it('returns an array of the expected length ', () => {
      expect(result.length).toBe(2);
    });
    it('orders the results in increasing time', () => {
      expect((0, _isBefore.default)(result[0].time, result[1].time)).toBeTruthy();
    });
  });
  describe('can parse 1 available and 1 interceding block', () => {
    const testAvailability = [{
      startDate: today9AM,
      endDate: today12PM
    }];
    const testBlock = [{
      startDate: today10AM,
      endDate: today11AM
    }];
    const result = (0, _reducer.createUnifiedTimeline)(testAvailability, testBlock);
    it('returns an array of the expected length ', () => {
      expect(result.length).toBe(4);
    });
  });
  describe('can parse 1 available and 2 interceding blocks', () => {
    const testAvailability = [{
      startDate: today9AM,
      endDate: today12PM
    }];
    const testBlock = [{
      startDate: today10AM,
      endDate: today1030AM
    }, {
      startDate: today930AM,
      endDate: today10AM
    }];
    const result = (0, _reducer.createUnifiedTimeline)(testAvailability, testBlock);
    it('returns an array of the expected length ', () => {
      expect(result.length).toBe(6);
    });
    const positives = result.filter(r => r.isAvailable).length;
    const negatives = result.filter(r => !r.isAvailable).length;
    it('has equal number of open/close entries', () => {
      expect(positives - negatives).toBe(0);
    });
  });
});