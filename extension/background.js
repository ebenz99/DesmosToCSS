let equations = {};
const parser = math.parser()

chrome.runtime.onMessage.addListener(
    function(request, sender) {
        if (request.cmd == 'addEquations'){
            requestEquations = JSON.parse(request.equations);
            Object.keys(requestEquations).map((key) => {
                equations[key] = requestEquations[key]
            });
        }
        else if (request.cmd == 'addParams') {
            if (!equations['x']) {
                alert('No equations! Please save and refresh your desmos page then try again.')
                return;
            }
            else {
                generateResult(equations, JSON.parse(request.params));
            }
        }
    }
);

const evalMath = (equations) => {;}

const generateResult = (equations, params) => {
    const mint = parseFloat(params['mint']);
    const maxt = parseFloat(params['maxt']);
    const stept = parseFloat(params['stept']);

    let rawVals = getRawVals(mint, maxt, stept);
    let proportionateVals = makeProportionate(rawVals);
}

const getPercent = (currVal, minVal, maxVal, numDecimals) => {
    if (numDecimals == 0) {
        return parseInt(((currVal - minVal) / maxVal) * 100);
    } 
    else {
        return (((currVal - minVal) / maxVal) * 100).toFixed(numDecimals);
    }
}

const getRawVals = (mint, maxt, stept) => {

    if (mint > maxt) {
        alert('Error: min t value greater than max t')
        throw 'Error: min t value greater than max t';   // this should probably be moved to popup logic
    }

    parser.evaluate(equations['x']);
    parser.evaluate(equations['y']);

    let vals = {'x': [], 'y':[]}
    let currt = mint;
    let diff = maxt - mint;
    while (currt <= maxt) {
        let xval = parser.evaluate(`x(${currt})`);
        let yval = parser.evaluate(`y(${currt})`);
        let percent = getPercent(currt, mint, maxt, 0);
        vals.x.push([parseInt(percent), parseFloat(xval)]);
        vals.y.push([parseInt(percent), parseFloat(yval)]);
        currt = currt + stept;
    }

    return vals;
}

const getMax = (val1, val2) => {
    return val1 > val2 ? val1 : val2;
}

const getMin = (val1, val2) => {
    return val1 < val2 ? val1 : val2;
}

const getMinMax = (rawVals, minMaxFunc) => {
    // long-winded and drawn out way of getting maxes of each set
    let extreme = Object.keys(rawVals).reduce((map, key) => {
        map[key] = rawVals[key].map((item) => (item[1])).reduce((currMax, curr) => {
            return minMaxFunc(currMax, curr)
        });
        return map;
    }, {});
    return extreme;
}

const makeProportionate = (rawVals) => {
    let maxes = getMinMax(rawVals, getMax);
    let mins = getMinMax(rawVals, getMin);
    let proportionateVals = Object.keys(rawVals).reduce((map, key) => {
        map[key] = rawVals[key].map((rawVal) => ([rawVal[0], ((rawVal[1] - mins[key])/(maxes[key] - mins[key])).toFixed(2)]));
        return map;
    }, {});

    alert(JSON.stringify(proportionateVals['y']));

}