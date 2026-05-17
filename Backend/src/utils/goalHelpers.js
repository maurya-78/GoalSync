// Check if adding a new weightage exceeds 100%
exports.isWeightageValid = (currentTotal, newWeight) => {
    return (currentTotal + newWeight) <= 100;
};

// Calculate Quarter based on current date
exports.getCurrentQuarter = () => {
    const month = new Date().getMonth() + 1;
    return (Math.ceil(month / 3));
};