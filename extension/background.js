let equations = {};

chrome.runtime.onMessage.addListener(
    function(request, sender) {
        if (request.cmd == 'addEquations'){
            requestEquations = JSON.parse(request.equations);
            Object.keys(requestEquations).map((key) => {
                equations[key] = requestEquations[key]
            });
        }
        else if (request.cmd == 'addParams') {
            doStuff();
        }
    }
);

const evalMath = (equations) => {;}

const doStuff = (things) => {;}