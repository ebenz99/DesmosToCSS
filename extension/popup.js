params = ['name', 'mint', 'maxt', 'stept'];


if (chrome.storage.local.get('DesmosToCSSVals', (val) => {
    if (val['DesmosToCSSVals'] == 'true') {
        params.map((param) => {
            if (param != 'name') {
                chrome.storage.local.get(`DesmosToCSS${param}`, (pair) => {
                    document.getElementById(param).value = parseFloat(pair[`DesmosToCSS${param}`]);
                });
            }
        })
    }
}));

const createParamDict = (params, prefix) => {
    if (! prefix) {
        prefix = ""
    }
    return params.reduce((map, param) => {
        map[prefix + param] = document.getElementById(param).value;
        return map;
    }, {});
}

document.addEventListener('DOMContentLoaded', function () {
    let form = document.getElementById("paramForm");
    form.addEventListener('submit',function(e){
        e.preventDefault();
        if ((document.getElementById('mint').value >= document.getElementById('maxt').value)){
            alert('Error: max t must be greater than min t')
            return;
        }
        if (document.getElementById('stept').value <= 0) {
            alert('Error: t must be greater than 0')
            return;
        }
        chrome.storage.local.set({'DesmosToCSSVals':'true'});
        let paramDict = createParamDict(params);
        let localParamDict = createParamDict(params, "DesmosToCSS");
        chrome.storage.local.set(localParamDict);
        chrome.runtime.sendMessage({cmd: "addParams", params: JSON.stringify(paramDict)});
    })
});

chrome.runtime.onMessage.addListener(
    function(request) {
        if (request.cmd === "displayKeyframes") {
            let text = JSON.parse(request.params)['keyframes'];
            document.getElementById('CSSText').innerHTML=text;
        }
    }
);