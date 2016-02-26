"use strict";
let kutil = require("./kmeans.util.js"),
    kMean = require("./kmeans.cluster.js").kMean,
    compactness = require("./kmeans.compactness.js").compactness;

let data = [[1,2], [4, 12], [2, 3], [10, 4], [7, 64], [8, 12], [2, 13], [6, 50], [10, 3], [7, 19], [20, 74],[3, 19], [50, 2], [10, 2], [3, 2], [5, 17], [9, 55], [5, 78], [50, 5], [4, 22], [73,2], [10, 10], [4, 4], [60,5], [65, 7], [55, 12], [15, 65], [60, 20], [5, 70]];
let sampleB = 10;

function randomPoints(data) {
    let maxX = data.reduce((max, curr) => curr[0] > max ? curr[0] : max , -Infinity),
    maxY = data.reduce((max, curr) => curr[1] > max ? curr[1] : max , -Infinity),
    minX = data.reduce((min, curr) => curr[0] < min ? curr[0] : min , Infinity),
    minY = data.reduce((min, curr) => curr[1] < min ? curr[1] : min , Infinity);

    return () => [Math.random() * (maxX - minX) + minX, Math.random() * (maxY - minY) + minY];
}

function generateDummyData(ptGenFunc, dataLen, numOfSamples) {
    return kutil.genArr(numOfSamples).map(() => kutil.genArr(dataLen).map(() => ptGenFunc()));
}

function referenceVariabilities(data, k) {
    let testSets = kutil.genArr(sampleB).map(() => referencePoints(data.length)),
        variabilities = testSets.map((tData) => compactness(tData, kMean(tData, k), k));
    return variabilities;
}

function calculateGap(data, k) {
    let foundVariability = compactness(data, kMean(data, k), k),
        refVariabilities = referenceVariabilities(data, k),
        expectedVariability = refVariabilities.map((vari) => Math.log(vari)).reduce(kutil.sum, 0) / sampleB;

    return expectedVariability - Math.log(foundVariability);
}

function possibleVariabilities(dataset) {
    return kutil.genArr(parseInt((dataset.length / 3) - 1, 10))
        .map((el, i) => compactness(dataset, kMean(dataset, i + 1)));
}

function optimalK(gapArr, s) {

    return gapArr.map((thisGap, k) => thisGap >= gapArr[k+1])
        .findIndex((gapSize) => gapSize) + 1;


}

function findRefStdDevs(varis) {
    let lBar = varis.map((kVaris) => kVaris.map(Math.log).reduce(kutil.sum, 0)),
        squaredVaris = varis.map((kVaris, kIndex) =>
            Math.pow(Math.log(kVaris.reduce(kutil.sum, 0)) - lBar[kIndex], 2)),
        standardDevs = varis.map((kVaris, kIndex) =>
            Math.sqrt(squaredVaris[kIndex]/sampleB)),
        s = standardDevs.map((sd) => sd * Math.sqrt(1+1/sampleB));

    return s;
}

function kMeansGap(data) {
    let referenceDataArr = generateDummyData(randomPoints(data), data.length, sampleB),
        solutionKMeans = kutil.genArr(parseInt((data.length / 3) - 1, 10))
            .map((el, i) => kMean(data, i + 1)),
        solutionVariabilities = solutionKMeans.map((el) => compactness(data, el)),
        solLogs = solutionVariabilities.map((el) => Math.log(el)),

        refVariabilities = referenceDataArr.map((refDataset) => possibleVariabilities(refDataset)),
        sumRefVariabilities = refVariabilities[0].map((el, kIndex) => refVariabilities.reduce((total, refVarByK) => total += refVarByK[kIndex], 0)),
        logRefVaris = sumRefVariabilities.map((el) => el / sampleB).map((el) => Math.log(el)),
        gaps = logRefVaris.map((refVari, index) => (refVari - solLogs[index])),
        s = findRefStdDevs(refVariabilities);

    return solutionKMeans[optimalK(gaps, s) - 1];
}

console.log((kMeansGap(data)));
