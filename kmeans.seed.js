"use strict";
let kutil = require("./kmeans.util.js");

function seed(data, k) {
    let centers = kutil.genArr(k).map(() => [undefined, undefined]);
    centers[0] = data[parseInt(Math.random() * data.length, 10)];
    return nextSeedPoint(data, centers, k);
}

function nextSeedPoint(data, centers, k) {
    let centersFilled = centers.reduce((count, center) => typeof center[0] === 'undefined' ? count : count + 1, 0);

    if (centersFilled !== k) {
        centers[centersFilled] = calculateCenter(data, centers);
        return nextSeedPoint(data, centers, k);
    } else {
        return centers;
    }
}

function calculateCenter(data, centers) {
    let distribution = genDistr(data, centers),
        rand = Math.random();

    for (let i = 0; i < distribution.length; i++) {
        rand -= distribution[i];
        if (rand <= 0) {
            return data[i];
        }
    }
}

function genDistr(data, centers) {
    let distances = data.map((pt) => {
            return centers.map((center) => typeof center[0] === 'undefined' ? Infinity : kutil.sqDist(center, pt));
    }).map((distArr) => distArr.reduce(kutil.min, Infinity)),
    totalDistance = distances.reduce(kutil.sum, 0),
        normalDistances = distances.map((dist) => dist / totalDistance);

    return normalDistances;
}

module.exports.seed = seed;