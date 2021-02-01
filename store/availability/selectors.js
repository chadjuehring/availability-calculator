import isBefore from 'date-fns/isBefore';
import addMinutes from 'date-fns/addMinutes';
import differenceInMinutes from 'date-fns/differenceInMinutes';

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

export function getAvailableFromTimeline(array, countOfAvailable, countOfBlocks, timeMinimum) {
    const activeAvailables = new Array(countOfAvailable).fill(false)
    const activeBlocks = new Array(countOfBlocks).fill(false)

    const result = [];

    let startTime;

    let atLeastOneActiveWasAvailable = false;
    let allBlocksWereInactive = true;

    for (let i = 0; i < array.length; i++) {
        const nextLog = array[i];

        const {isAvailable, time, index, availableBlock} = nextLog;

        if (availableBlock) {
            activeAvailables[index] = isAvailable;
        } else {
            activeBlocks[index] = !isAvailable; // if available is `false`, that means blocking is `true`
        }

        const atLeastOneActiveRemainsAvailable = atLeastOneTrue(activeAvailables);
        const allBlocksAreInactive = allAreFalse(activeBlocks);


        if (
            !atLeastOneActiveWasAvailable
            && atLeastOneActiveRemainsAvailable
            && allBlocksAreInactive
        ) {
            startTime = time;
        }

        if (
            atLeastOneActiveWasAvailable
            && !atLeastOneActiveRemainsAvailable
        ) {
            result.push({startTime, endTime: time});
            startTime = null;
        }

        if (
            atLeastOneActiveWasAvailable
            && atLeastOneActiveRemainsAvailable
            && allBlocksWereInactive
            && !allBlocksAreInactive
        ) {
            result.push({startTime, endTime: time});
            startTime = null;
        }

        if (
            atLeastOneActiveWasAvailable
            && atLeastOneActiveRemainsAvailable
            && !allBlocksWereInactive
            && allBlocksAreInactive
        ) {
            startTime = time;
        }

        allBlocksWereInactive = allBlocksAreInactive;
        atLeastOneActiveWasAvailable = atLeastOneActiveRemainsAvailable;
    }

    return result;
}

export function getAvailable(state, timeSlotMinutes = 30, startIncrementSlotsMinutes = 30) {
    if (!state.timeline || !state.availabilities || !state.blocked) {
        return null;
    }

    const result = [];

    const candidateSegments = getAvailableFromTimeline(state.timeline, state.availabilities.length, state.blocked.length);

    const filtered = candidateSegments.filter(slot => {
        const {startTime, endTime} = slot;
        return differenceInMinutes(endTime, startTime) >= timeSlotMinutes;
    });

    filtered.forEach(slot => {
        const {startTime, endTime} = slot;

        let nextStartTime = addMinutes(startTime, 0);
        let testEndTime = addMinutes(nextStartTime, timeSlotMinutes);

        // if there is still enough room between the start and end, then lets add a time slot
        while (isBefore(testEndTime, addMinutes(endTime, 0.25))) {
            result.push({startTime: nextStartTime, endTime: testEndTime})
            nextStartTime = addMinutes(nextStartTime, startIncrementSlotsMinutes);
            testEndTime = addMinutes(nextStartTime, timeSlotMinutes);
        }
    })

    console.log({candidateSegments, filtered, result, timeSlotMinutes})

    return result;
}