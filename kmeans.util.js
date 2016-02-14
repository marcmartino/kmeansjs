module.exports.sqDist = (dp1, dp2) => {
    return (dp1[0] - dp2[0]) * (dp1[0] - dp2[0]) + (dp1[1] - dp2[1]) * (dp1[1] - dp2[1]);
};
module.exports.min = (min, curr) => curr < min ? curr : min;
module.exports.sum = (total, curr) => total + curr;

module.exports.genArr = function (len) {
    return Array.apply(null, Array(len)).map(function () {
    });
};
