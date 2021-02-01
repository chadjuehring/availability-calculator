import {CREATE_AVAILABILITY_SLOT, CREATE_AVAILABILITY_BLOCK} from "./types";

export function createAvailabilitySlot(startDate, endDate) {
    return {
        type: CREATE_AVAILABILITY_SLOT,
        payload: {
            startDate,
            endDate,
        }
    }

}


export function createAvailabilityBlock(startDate, endDate) {
    return {
        type: CREATE_AVAILABILITY_BLOCK,
        payload: {
            startDate,
            endDate,
        }
    }
}