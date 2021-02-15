"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAvailabilitySlot = createAvailabilitySlot;
exports.createAvailabilityBlock = createAvailabilityBlock;

var _types = require("./types");

function createAvailabilitySlot(startDate, endDate) {
  return {
    type: _types.CREATE_AVAILABILITY_SLOT,
    payload: {
      startDate,
      endDate
    }
  };
}

function createAvailabilityBlock(startDate, endDate) {
  return {
    type: _types.CREATE_AVAILABILITY_BLOCK,
    payload: {
      startDate,
      endDate
    }
  };
}