"use strict";
let kutil = require("./kmeans.util.js"),
    kMean = require("./kmeans.cluster.js").kMean;

let data = [[1, 2], [4, 12], [2, 3], [10, 4], [7, 64], [20, 74], [8, 12], [2, 13], [6, 50], [10, 3], [7, 19],
    [3, 19], [50, 2], [10, 2], [3, 2], [5, 17], [9, 55], [5, 99], [50, 5], [4, 22], [73, 2], [10, 10], [4, 4]];
let sampleB = 10;

function randomPoints(data) {
    let maxX = data.reduce((max, curr) => curr[0] > max ? curr[0] : max , -Infinity),
    maxY = data.reduce((max, curr) => curr[1] > max ? curr[1] : max , -Infinity),
    minX = data.reduce((min, curr) => curr[0] < min ? curr[0] : min , Infinity),
    minY = data.reduce((min, curr) => curr[1] < min ? curr[1] : min , Infinity);

    return () => [Math.random() * (maxX - minX) + minX, Math.random() * (maxY - minY) + minY];
}
let randomPointGen = randomPoints(data);
function referencePoints(len) {
    return kutil.genArr(len).map(() => randomPointGen());
}

function referenceVariabilities(data, k) {
    let testSets = kutil.genArr(sampleB).map(() => referencePoints(data.length)),
    variabilities = testSets.map((tData) => calculateVariability(tData, kMean(tData, k), k));
    return variabilities;
}

function sortClusterPoints(allPointsObj, pt, index) {
    let closestPtIndex = allPointsObj.reduce((minIndex, curr, index) => kutil.sqDist(pt, curr.centroid) < kutil.sqDist(pt, allPointsObj[minIndex].centroid) ? index : minIndex, 0);
    allPointsObj[closestPtIndex].dps.push(pt);
    return allPointsObj;
}

function findDistanceFromCentroid(centroidObj) {
    centroidObj.dist = centroidObj.dps.reduce((total, curr) => total + kutil.sqDist(curr, centroidObj.centroid), 0);
    //centroidObj.dist *=  2 * centroidObj.dps.length;
    return centroidObj;
}

function icDistance(clusterPts, data) {
    let dpByCluster = data.reduce(sortClusterPoints, clusterPts.map((pt) => {return {dps: [], centroid: pt}; })),
dpWithDistance = dpByCluster.map(findDistanceFromCentroid);

return dpWithDistance;
}

function calculateVariability(data, centerPoints, k) {
    return icDistance(centerPoints, data).reduce((total, cluster) => total + cluster.dist, 0);
}

function calculateGap(data, k) {
    let foundVariability = calculateVariability(data, kMean(data, k), k),
        refVariabilities = referenceVariabilities(data, k),
        expectedVariability = refVariabilities.map((vari) => Math.log(vari)).reduce(kutil.sum, 0) / sampleB;

    return expectedVariability - Math.log(foundVariability);
}

function kMeansGap(data) {
    let kMeansPoints = [],
        compactness = [],
        gaps = kutil.genArr(parseInt((data.length / 3) - 1, 10)).map((el, index) => calculateGap(data, index + 1));

    return gaps;
}


//console.log(calculateGap(data, 3));
console.log((kMeansGap(data)));
