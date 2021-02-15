"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUnifiedTimeline = createUnifiedTimeline;
exports.reducer = reducer;

var _isBefore = _interopRequireDefault(require("date-fns/isBefore"));

var _initialState = require("./initial-state");

var types = _interopRequireWildcard(require("./types"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createUnifiedTimeline(available = [], blocked = []) {
  const startAvailable = available.map((slot, index) => ({
    isAvailable: true,
    time: slot.startDate,
    index,
    availableBlock: true
  }));
  const endAvailable = available.map((slot, index) => ({
    isAvailable: false,
    time: slot.endDate,
    index,
    availableBlock: true
  }));
  const startBlocked = blocked.map((slot, index) => ({
    isAvailable: false,
    time: slot.startDate,
    index,
    availableBlock: false
  }));
  const end = blocked.map((slot, index) => ({
    isAvailable: true,
    time: slot.endDate,
    index,
    availableBlock: false
  }));
  return [...startAvailable, ...endAvailable, ...startBlocked, ...end].sort((a, b) => (0, _isBefore.default)(a.time, b.time) ? -1 : 1);
}

function reducer(prevState = (0, _initialState.getInitialState)(), action) {
  switch (action.type) {
    case types.CREATE_AVAILABILITY_SLOT:
      const nextAvailabilities = [...prevState.availabilities, _objectSpread({}, action.payload)];
      return _objectSpread(_objectSpread({}, prevState), {}, {
        availabilities: nextAvailabilities,
        timeline: createUnifiedTimeline(nextAvailabilities, prevState.blocked)
      });

    case types.CREATE_AVAILABILITY_BLOCK:
      const nextBlocked = [...prevState.blocked, _objectSpread({}, action.payload)];
      return _objectSpread(_objectSpread({}, prevState), {}, {
        blocked: nextBlocked,
        timeline: createUnifiedTimeline(prevState.availabilities, nextBlocked)
      });

    default:
      return prevState;
  }
}