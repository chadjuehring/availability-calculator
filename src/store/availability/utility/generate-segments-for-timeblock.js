import differenceInMinutes from "date-fns/differenceInMinutes";
import addMinutes from 'date-fns/addMinutes';

export function generateSegmentsForTimeBlock(timeslot, timeSlotMinutes, startIncrementSlotsMinutes) {
    const {startTime, endTime} = timeslot;

    const totalMinutes = differenceInMinutes(endTime, startTime);
    const totalMinusMeetingLength = totalMinutes - timeSlotMinutes;

    if (totalMinutes === timeSlotMinutes) {
        return [{ startTime, endTime }];
    }

    if (totalMinusMeetingLength > 0) {
        const availableSlots = 1 + (totalMinusMeetingLength / startIncrementSlotsMinutes);
        const slots = new Array(availableSlots).fill(null);

        return slots.map((item, index) => {
            const offset = index * startIncrementSlotsMinutes;
            return {
                startTime: addMinutes(startTime, offset),
                endTime: addMinutes(startTime, offset + timeSlotMinutes),
            };
        })
    }

    return [];
}