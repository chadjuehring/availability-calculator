"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  AvailabilityCalculator: true
};
exports.AvailabilityCalculator = exports.default = void 0;

var _redux = require("redux");

var _initialState = require("./initial-state");

var _reducer = require("./reducer.js");

var _actions = require("./actions");

var _selectors = require("./selectors");

var _actions2 = require("./actions.js");

Object.keys(_actions2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _actions2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _actions2[key];
    }
  });
});

var _selectors2 = require("./selectors.js");

Object.keys(_selectors2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _selectors2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _selectors2[key];
    }
  });
});
const store = (0, _redux.createStore)(_reducer.reducer, (0, _initialState.getInitialState)());
var _default = store; // OOP interface for those that might want it

exports.default = _default;

class AvailabilityCalculator {
  constructor() {
    this.store = (0, _redux.createStore)(_reducer.reducer, (0, _initialState.getInitialState)());
  }

  addAvailability(startDate, endDate) {
    this.store.dispatch((0, _actions.createAvailabilitySlot)(startDate, endDate));
  }

  addBlock(startDate, endDate) {
    this.store.dispatch((0, _actions.createAvailabilityBlock)(startDate, endDate));
  }

  getAvailability(timeSlotLengthMinutes, incrementsOnTheHour) {
    return (0, _selectors.getAvailable)(this.store.getState(), timeSlotLengthMinutes, incrementsOnTheHour);
  }

}

exports.AvailabilityCalculator = AvailabilityCalculator;