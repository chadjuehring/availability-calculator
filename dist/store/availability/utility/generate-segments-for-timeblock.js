"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateSegmentsForTimeBlock = generateSegmentsForTimeBlock;

var _differenceInMinutes = _interopRequireDefault(require("date-fns/differenceInMinutes"));

var _addMinutes = _interopRequireDefault(require("date-fns/addMinutes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateSegmentsForTimeBlock(timeslot, timeSlotMinutes, startIncrementSlotsMinutes) {
  const {
    startTime,
    endTime
  } = timeslot;
  const totalMinutes = (0, _differenceInMinutes.default)(endTime, startTime);
  const totalMinusMeetingLength = totalMinutes - timeSlotMinutes;

  if (totalMinutes === timeSlotMinutes) {
    return [{
      startTime,
      endTime
    }];
  }

  if (totalMinusMeetingLength > 0) {
    const availableSlots = 1 + totalMinusMeetingLength / startIncrementSlotsMinutes;
    const slots = new Array(availableSlots).fill(null);
    return slots.map((item, index) => {
      const offset = index * startIncrementSlotsMinutes;
      return {
        startTime: (0, _addMinutes.default)(startTime, offset),
        endTime: (0, _addMinutes.default)(startTime, offset + timeSlotMinutes)
      };
    });
  }

  return [];
}