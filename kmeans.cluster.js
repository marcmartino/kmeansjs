"use strict";

let kutil = require("./kmeans.util.js"),
    seed = require("./kmeans.seed.js").seed;

function recalculatePositions(points) {
    return function (pointAvgs, dp) {
        let distances = points.map((pt) => kutil.sqDist(pt, dp)),
        closestPt = distances.reduce((min, curr, index) => distances[index] < distances[min] ? index : min , 0);

        pointAvgs[closestPt][0][0] += dp[0];
        pointAvgs[closestPt][0][1] += dp[1];
        pointAvgs[closestPt][1]++;
        return pointAvgs;
    }
}

function similarPoints(pts1, pts2) {
    let sumDistance = pts1.reduce((total, curr, index) => total + kutil.sqDist(curr, pts2[index]), 0);
    return sumDistance <= .001 ? true : false;
}

function avgPoints(pointData) {
    return pointData.map((arr) => arr[1] === 0 ? undefined : [arr[0][0] / arr[1], arr[0][1] / arr[1]]);
}

function kMean(data, numOfPoints) {
    let points = seed(data, numOfPoints),
        pointValues,
        newPoints = kutil.genArr(numOfPoints);

    do {
        if (typeof newPoints[0] !== 'undefined') {
            points = newPoints;
        }
        pointValues = data.reduce(recalculatePositions(points), kutil.genArr(numOfPoints).map(() => [[0,0], 0]));
        newPoints = avgPoints(pointValues);
    } while (!similarPoints(points, newPoints));

    return points;
}

module.exports.kMean = kMean;

