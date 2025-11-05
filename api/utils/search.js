

/**
 * Binary Search
 * @param {Array} arr - Sorted array
 * @param {any} target - Value to search
 * @param {Function} getValue - Optional function to extract comparable value from object
 * @returns {number} - index of found element, -1 if not found
 */
export const binarySearch = (arr, target, getValue = (x) => x) => {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const midVal = getValue(arr[mid]);

        if (midVal === target) return mid;
        if (midVal < target) left = mid + 1;
        else right = mid - 1;
    }

    return -1; // not found
};
