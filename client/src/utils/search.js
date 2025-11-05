

// Generic binary search function
export const binarySearch = (array, target, getKey) => {
    let left = 0;
    let right = array.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const value = getKey(array[mid]);

        if (value === target) {
            return mid; // found
        } else if (value < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1; // not found
};
