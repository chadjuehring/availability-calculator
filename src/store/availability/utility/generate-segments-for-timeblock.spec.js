import set from 'date-fns/set';
import startOfToday from 'date-fns/startOfDay';

import { generateSegmentsForTimeBlock } from "./generate-segments-for-timeblock";

const midnight = startOfToday(new Date());
const today9AM = set(midnight, {hours: 9});
const today930AM = set(midnight, {hours: 9, minutes: 30});
const today10AM = set(midnight, {hours: 10});
const today1030AM = set(midnight, {hours: 10, minutes: 30});
const today11AM = set(midnight, {hours: 11});
const today1130AM = set(midnight, {hours: 11, minutes: 30});
const today12PM = set(midnight, {hours: 12});

describe('generate-segments-for-timeblock utility function', () => {
    it('returns the 1 30-minute slot that exists between 9AM and 930AM', () => {
        const testTimeSlot = { startTime: today9AM, endTime: today930AM };
        const result = generateSegmentsForTimeBlock(testTimeSlot, 30, 30);
        expect(result.length).toBe(1);
    });

    it('returns the 2 30-minute slots that exists between 9AM and 100AM', () => {
        const testTimeSlot = { startTime: today9AM, endTime: today10AM };
        const result = generateSegmentsForTimeBlock(testTimeSlot, 30, 30);
        expect(result.length).toBe(2);
    });

    it('returns the 3 30-minute slots that exists between 9AM and 100AM with 15 minute start increment', () => {
        const testTimeSlot = { startTime: today9AM, endTime: today10AM };
        const result = generateSegmentsForTimeBlock(testTimeSlot, 30, 15);
        expect(result.length).toBe(3);
    });
})