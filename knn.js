var xys = [{"x":[1,6],"y":7},{"x":[2,4],"y":8},{"x":[3,7],"y":16},{"x":[6,8],"y":44},{"x":[7,1],"y":50},{"x":[8,4],"y":68}];
var euDist = (pt1, pt2) => Math.sqrt(Math.pow(pt1[0] - pt2[0], 2) + Math.pow(pt1[1] - pt2[1], 2));
var manDist = (pt1, pt) => pt1[0] - pt2[0] + pt1[1] - pt2[1];
var genArr = function (len) {
    return Array.apply(null, Array(len)).map(function () {
    });
};

function kNN(data, k, distFunc) {
    "use strict";
    var usingDistFunc = distFunc || euDist;
    //nearestElements(data, k, distFunc);
    var closestElems = data.reduce(nearestElements(k, distFunc), [])
}

function nearestElements(k, distFunc) {
    "use strict";
    return function (minPoints, dataPt, index) {
        var minIndex;
        if (minPoints.length < k) {
            minPoints.push(dataPt);
            return minPoints;
        }
        minIndex = Array.keys(minPoints).reduce(((dataPt) => (minI, thisMinPt, allPts) => {
            var thisDist = distFunc(thisMinPt.x, dataPt.x),
                minDist = distFunc(thisMinPt.x, allPts[minI].x);
        })(dataPt), -1);

    }
}



function findMinOfMins(allMins, thisMin) {
    "use strict";
    return function (minIndex, thisIndex) {
        debugger;
        var existingDist = thisMin - (allMins[minIndex] || 0),
            thisDist = thisMin - allMins[thisIndex];
        if (thisDist < existingDist) {
            return thisIndex;
        }
        return minIndex;
    }
}
var tempMins = [2,3,1];
var newMinIndex = [0,1,2].reduce(findMinOfMins(tempMins, 1.5), -1);
if (newMinIndex >= 0) {
    tempMins[newMinIndex] = 1.5;
}
console.log(newMinIndex, tempMins);