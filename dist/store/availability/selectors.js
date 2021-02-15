"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAvailableFromTimeline = getAvailableFromTimeline;
exports.getAvailable = getAvailable;

var _isBefore = _interopRequireDefault(require("date-fns/isBefore"));

var _addMinutes = _interopRequireDefault(require("date-fns/addMinutes"));

var _differenceInMinutes = _interopRequireDefault(require("date-fns/differenceInMinutes"));

var _generateSegmentsForTimeblock = require("./utility/generate-segments-for-timeblock");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function atLeastOneTrue(array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i]) {
      return true;
    }
  }

  return false;
}

function allAreFalse(array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i]) {
      return false;
    }
  }

  return true;
}

function getAvailableFromTimeline(array, countOfAvailable, countOfBlocks, timeMinimum) {
  const activeAvailables = new Array(countOfAvailable).fill(false);
  const activeBlocks = new Array(countOfBlocks).fill(false);
  const result = [];
  let startTime; // initial state is no availability is declared and no blocks yet applied

  let atLeastOneActiveWasAvailable = false;
  let allBlocksWereInactive = true;

  for (let i = 0; i < array.length; i++) {
    const nextLog = array[i];
    const {
      isAvailable,
      time,
      index,
      availableBlock
    } = nextLog;

    if (availableBlock) {
      activeAvailables[index] = isAvailable;
    } else {
      activeBlocks[index] = !isAvailable; // if available is `false`, that means blocking is `true`
    }

    const atLeastOneActiveRemainsAvailable = atLeastOneTrue(activeAvailables);
    const allBlocksAreInactive = allAreFalse(activeBlocks);

    if (!atLeastOneActiveWasAvailable && atLeastOneActiveRemainsAvailable && allBlocksAreInactive) {
      startTime = time;
    }

    if (atLeastOneActiveWasAvailable && !atLeastOneActiveRemainsAvailable) {
      result.push({
        startTime,
        endTime: time
      });
      startTime = null;
    }

    if (atLeastOneActiveWasAvailable && atLeastOneActiveRemainsAvailable && allBlocksWereInactive && !allBlocksAreInactive) {
      result.push({
        startTime,
        endTime: time
      });
      startTime = null;
    }

    if (atLeastOneActiveWasAvailable && atLeastOneActiveRemainsAvailable && !allBlocksWereInactive && allBlocksAreInactive) {
      startTime = time;
    }

    allBlocksWereInactive = allBlocksAreInactive;
    atLeastOneActiveWasAvailable = atLeastOneActiveRemainsAvailable;
  }

  return result;
}

function getAvailable(state, timeSlotMinutes, startIncrementSlotsMinutes) {
  if (!state.timeline || !state.availabilities || !state.blocked) {
    return null;
  }

  const candidateSegments = getAvailableFromTimeline(state.timeline, state.availabilities.length, state.blocked.length);
  const filtered = candidateSegments.filter(({
    endTime,
    startTime
  }) => (0, _differenceInMinutes.default)(endTime, startTime) >= timeSlotMinutes);
  return filtered.map(item => (0, _generateSegmentsForTimeblock.generateSegmentsForTimeBlock)(item, timeSlotMinutes, startIncrementSlotsMinutes)).reduce((acc, next) => {
    return acc.concat(...next);
  });
}