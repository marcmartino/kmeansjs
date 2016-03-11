var xys = [{"x":[1,6],"y":7},{"x":[2,4],"y":8},{"x":[3,7],"y":16},{"x":[6,8],"y":44},{"x":[7,1],"y":50},{"x":[8,4],"y":68}];
var euDist = (pt1, pt2) => Math.sqrt(Math.pow(pt1[0] - pt2[0], 2) + Math.pow(pt1[1] - pt2[1], 2));
var manDist = (pt1, pt2) => pt1[0] - pt2[0] + pt1[1] - pt2[1];
var genArr = function (len) {
    return Array.apply(null, Array(len)).map(function () {
    });
};
var pluck = (prop) => (el) => el[prop];

function kNN(data) {
    "use strict";
    return function (pt, k, distFunc) {
        var usingDistFunc = distFunc || euDist;

        return data.reduce(nearestElements(pt,k, usingDistFunc), [])
            .map(pluck('y')).reduce((total, val) => total + (val/k), 0);
    }
}

function nearestElements(pt, k, distFunc) {
    "use strict";
    return function (currentMins, potentialMin) {
        var replaceIndex;

        if (currentMins.length < k) {
            currentMins.push(potentialMin);
            return currentMins;
        }
        replaceIndex = currentMins.reduce(findMinIndex(pt, potentialMin, distFunc), -1);
        if (replaceIndex >= 0) {
            currentMins[replaceIndex] = potentialMin;
        }
        return currentMins;
    }
}

function findMinIndex(pt, testMinPt, distFunc) {
    "use strict";
    var distFromTestMin = distFunc(pt, testMinPt.x);
    return function (runningMinIndex, estabilishedMinObj, establishedMinIndex, allEstablishedMinObj) {

        var distFromEstablishedMin = distFunc(pt, estabilishedMinObj.x);

        if (distFromTestMin < distFromEstablishedMin) {
            if (runningMinIndex == -1) {
                return establishedMinIndex;
            }
            else if (distFromTestMin < distFunc(pt, allEstablishedMinObj[runningMinIndex].x)) {
                return establishedMinIndex;
            }
        }
        return runningMinIndex;
    }
}

var knnFunc = kNN(xys);

console.log(knnFunc([4,2], 1));
console.log(knnFunc([4,2], 1, manDist));
console.log(knnFunc([4,2], 3));
console.log(knnFunc([4,2], 3, manDist));