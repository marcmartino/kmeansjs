"use strict";
let kutil = require("./kmeans.util.js")

function sortClusterPoints(allPointsObj, pt, index) {
    let closestPtIndex = allPointsObj.reduce((minIndex, curr, index) =>
        kutil.sqDist(pt, curr.centroid) < kutil.sqDist(pt, allPointsObj[minIndex].centroid) ?
            index : minIndex, 0);
    allPointsObj[closestPtIndex].dps.push(pt);
    return allPointsObj;
}

function findDistanceFromCentroid(centroidObj) {
    centroidObj.dist = centroidObj.dps.reduce((total, curr) => total + kutil.sqDist(curr, centroidObj.centroid), 0);
    return centroidObj;
}

function icDistance(clusterPts, data) {
    let dpByCluster = data.reduce(sortClusterPoints, clusterPts.map((pt) => {return {dps: [], centroid: pt}; })),
        dpWithDistance = dpByCluster.map(findDistanceFromCentroid);

    return dpWithDistance;
}

function compactness(data, centerPoints) {
    return icDistance(centerPoints, data).reduce((total, cluster) => total + cluster.dist, 0);
}

module.exports.compactness = compactness;