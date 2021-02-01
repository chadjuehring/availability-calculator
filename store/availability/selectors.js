import isBefore from 'date-fns/isBefore'

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

export function getAvailableFromFormattedArray(array, countOfAvailable, countOfBlocks, timeMinimum) {
    const activeAvailables = new Array(countOfAvailable).fill(false)
    const activeBlocks = new Array(countOfBlocks).fill(false)

    const result = [];

    let startTime;

    let atLeastOneActiveWasAvailable = false;
    let allBlocksWereInactive = true;

    for (let i = 0; i < array.length; i++) {
        // const atLeastOneActiveWasAvailable = atLeastOneTrue(activeAvailables);
        // const allBlocksWereInactive = allAreFalse(activeBlocks);

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
            result.push({ startTime, endTime: time });
            startTime = null;
        }

        if (
            atLeastOneActiveWasAvailable
            && atLeastOneActiveRemainsAvailable
            && allBlocksWereInactive
            && !allBlocksAreInactive
        ) {
            result.push({ startTime, endTime: time });
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

export function getAvailable(state, timeSlotMinutes) {
    if (!state.timeline || !state.availabilities || !state.blocked) { return null; }

    return getAvailableFromFormattedArray(state.timeline, state.availabilities.length, state.blocked.length);
}