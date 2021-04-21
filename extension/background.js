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
    const name = params['name'];
    const mint = parseFloat(params['mint']);
    const maxt = parseFloat(params['maxt']);
    const stept = parseFloat(params['stept']);

    let rawVals = getRawVals(mint, maxt, stept);
    let proportionateVals = makeProportionate(rawVals);
    let generatedCSS = createCSS(name, proportionateVals);
    alert(generatedCSS);
}

const getPercent = (currVal, minVal, maxVal, numDecimals) => {
    if (numDecimals == 0) {
        return parseInt(((currVal - minVal) / maxVal - minVal) * 100);
    } 
    else {
        return (((currVal - minVal) / (maxVal - minVal)) * 100).toFixed(numDecimals);
    }
}


// ((rawVal[1] - mins[key])/(maxes[key] - mins[key])).toFixed(2)

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

const makeKeyframe = (percent, x, y) => {
    const line = `  ${percent}% {left:${x}  bottom:${y}}\n`;
    return line;
}

const createCSS = (name, proportionateVals) => {
    const firstLine = `@keframes ${name} {\n`;
    let frames = '';
    const numFrames = proportionateVals['x'].length;
    for (let i = 0; i < numFrames; i++) {
        frames += makeKeyframe(proportionateVals['x'][i][0],proportionateVals['x'][i][1],proportionateVals['y'][i][1])
    }
    const lastLine = '}\n';
    return firstLine + frames + lastLine;
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
        map[key] = rawVals[key].map((rawVal) => ([rawVal[0], getPercent(rawVal[1], mins[key], maxes[key], 2)]));
        return map;
    }, {});
    return proportionateVals;
}

// ((rawVal[1] - mins[key])/(maxes[key] - mins[key])).toFixed(2)

`
@keyframes floater {
    0%   {left:100%; top:78.4%;}
    10%  {left:70.9%; top:100%;}
    20%  {left:19.9%; top:75.2%;}
    30%  {left:00.5%; top:23.4%;}
    40%  {left:20.4%; top:0%;}
    50%  {left:36.1%; top:22.7%;}
    60%  {left:19.7%; top:54.4%;}
    70%  {left:0.4%; top:57.9%;}
    80%  {left:21%; top:41.8%;}
    90%  {left:73.8%; top:46.9%;}
    100%   {left:100%; top:78.4%;}
  } 
`