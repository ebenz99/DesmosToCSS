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
                //url: "about:blank"
                chrome.tabs.create({url: "about:blank"}, ((tab) => {
                    // tab.title = "CSS";
                    // chrome.tabs.executeScript(tab.id, {code: "(() => {alert('test')})()"}, () => {});
                    chrome.tabs.executeScript(tab.id, {code: "(() => {alert('test')})()", matchAboutBlank: true}, () => {});
                    // tab.getElementByTag
                    // scripting.executeScript({target: {tabId: tab.id}, files:['newTab.js']}, ()=>{})
                    // scripting.executeScript({target: {tabId: tab.id}, function:(() => {alert('test')})}, ()=>{})
                }));
            }
        }
    }
);

const generateResult = (equations, params) => {
    const name = params['name'];
    const mint = parseFloat(params['mint']);
    const maxt = parseFloat(params['maxt']);
    const stept = parseFloat(params['stept']);

    let rawVals = getRawVals(mint, maxt, stept);
    let proportionateVals = makeProportionate(rawVals);
    let generatedCSS = createCSS(name, proportionateVals);
    // alert(generatedCSS);
}

const getPercent = (currVal, minVal, maxVal, numDecimals) => {
    if (numDecimals == 0) {
        // calculates a raw percentage
        return parseInt(((currVal - minVal) / (maxVal - minVal)) * 100);
    } 
    else {
        // more often used for exact page position
        return (((currVal - minVal) / (maxVal - minVal)) * 100).toFixed(numDecimals);
    }
}

// gets each coord from min, max, and step
const getRawVals = (mint, maxt, stept) => {
    parser.evaluate(equations['x']);
    parser.evaluate(equations['y']);

    let vals = {'x': [], 'y':[]}
    let currt = mint;
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

// gets max of two values
const getMax = (val1, val2) => {
    return val1 > val2 ? val1 : val2;
}

// gets min of two values
const getMin = (val1, val2) => {
    return val1 < val2 ? val1 : val2;
}

// creates a single keyframe from coords and percentage
const makeKeyframe = (percent, x, y) => {
    const line = `  ${percent}% {left:${x};  bottom:${y};}\n`;
    return line;
}

// builds CSS text from keyframes
const createCSS = (name, proportionateVals) => {
    const firstLine = `@keyframes ${name} {\n`;
    let frames = '';
    const numFrames = proportionateVals['x'].length;
    for (let i = 0; i < numFrames; i++) {
        frames += makeKeyframe(proportionateVals['x'][i][0],proportionateVals['x'][i][1],proportionateVals['y'][i][1])
    }
    const lastLine = '}\n';
    return firstLine + frames + lastLine;
}

const getMinMax = (rawVals, minMaxFunc) => {
    // long-winded and drawn out way of getting either mins or maxes of each set
    let extreme = Object.keys(rawVals).reduce((map, key) => {
        map[key] = rawVals[key].map((item) => (item[1])).reduce((currMax, curr) => {
            return minMaxFunc(currMax, curr)
        });
        return map;
    }, {});
    return extreme;
}

// standardizes values to minimum
const makeProportionate = (rawVals) => {
    let maxes = getMinMax(rawVals, getMax);
    let mins = getMinMax(rawVals, getMin);
    let proportionateVals = Object.keys(rawVals).reduce((map, key) => {
        map[key] = rawVals[key].map((rawVal) => ([rawVal[0], getPercent(rawVal[1], mins[key], maxes[key], 2)]));
        return map;
    }, {});
    return proportionateVals;
}
