import {getAvailableFromFormattedArray} from "./selectors";

const testArray =
    [
        {
            isAvailable: true,
            time: '2021-01-31T15:00:00.000Z',
            index: 0,
            availableBlock: true
        },
        {
            isAvailable: false,
            time: '2021-01-31T15:30:00.000Z',
            index: 1,
            availableBlock: false
        },
        {
            isAvailable: false,
            time: '2021-01-31T16:00:00.000Z',
            index: 0,
            availableBlock: false
        },
        {
            isAvailable: true,
            time: '2021-01-31T16:00:00.000Z',
            index: 1,
            availableBlock: false
        },
        {
            isAvailable: true,
            time: '2021-01-31T16:30:00.000Z',
            index: 0,
            availableBlock: false
        },
        {
            isAvailable: false,
            time: '2021-01-31T18:00:00.000Z',
            index: 0,
            availableBlock: true
        }
    ]


describe('getAvailableFromFormattedArray', () => {
    it('creates time slots for a series of flattened date flags', () => {
        const result = getAvailableFromFormattedArray(testArray, 1, 2)
        console.log({ result });
    })

})