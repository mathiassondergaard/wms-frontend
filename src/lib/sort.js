export const sortByObject = (sortOrder) => {
    sortOrder.reduce((obj, item, index) => {
        return {
            ...obj,
            [item]: index,
        };
    }, {});
};

