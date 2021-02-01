import set from 'date-fns/set';
import startOfToday from 'date-fns/startOfDay';
import isBefore from 'date-fns/isBefore';

import { createUnifiedTimeline} from "./reducer";

describe('create unified timeline', () => {
    const midnight = startOfToday(new Date());
    const today9AM = set(midnight, { hours: 9 });
    const today930AM = set(midnight, { hours: 9, minutes: 30 });
    const today10AM = set(midnight, { hours: 10 });
    const today1030AM = set(midnight, { hours: 10, minutes: 30 });
    const today11AM = set(midnight, { hours: 11 });
    const today1130AM = set(midnight, { hours: 11, minutes: 30 });
    const today12PM = set(midnight, { hours: 12 });

    describe('create timeline with no blocks', () => {
        const testAvailability = [{ startDate: today9AM, endDate: today12PM }];

        const result = createUnifiedTimeline(testAvailability, []);

        it('returns an array of the expected length ', () => {
            expect(result.length).toBe(2);
        });

        it('orders the results in increasing time', () => {
            expect(isBefore(result[0].time, result[1].time)).toBeTruthy();
        });
    });

    describe('can parse 1 available and 1 interceding block', () => {
        const testAvailability = [{ startDate: today9AM, endDate: today12PM }];
        const testBlock = [{ startDate: today10AM, endDate: today11AM }];
        const result = createUnifiedTimeline(testAvailability, testBlock);

        it('returns an array of the expected length ', () => {
            expect(result.length).toBe(4);
        });
    });

    describe('can parse 1 available and 2 interceding blocks', () => {
        const testAvailability = [{ startDate: today9AM, endDate: today12PM }];
        const testBlock = [
            { startDate: today10AM, endDate: today1030AM },
            { startDate: today930AM, endDate: today10AM },
        ];
        const result = createUnifiedTimeline(testAvailability, testBlock);

        console.log({ result })

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