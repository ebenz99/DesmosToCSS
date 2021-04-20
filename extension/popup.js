// document.addEventListener('DOMContentLoaded', function() {
//     let submitPageButton = document.getElementById('submitParams');
//     //*[contains(concat( " ", @class, " " ), concat( " ", "dcg-mq-root-block", " " ))]
//     submitPageButton.addEventListener('click', function() {
//         // chrome.tabs.getSelected(null, function(tab) {
//         //     d = document;
            
//         //     // var f = d.createElement('form');
//         //     // f.action = 'http://gtmetrix.com/analyze.html?bm';
//         //     // f.method = 'post';
//         //     // var i = d.createElement('input');
//         //     // i.type = 'hidden';
//         //     // i.name = 'url';
//         //     // i.value = tab.url;
//         //     // f.appendChild(i);
//         //     // d.body.appendChild(f);
//         //     // f.submit();
//         //     alert( getElementByXpath(d,'//nobr') );
//         // });
//         alert('test');
//     }, false);
//   }, false);

params = ['name', 'mint', 'maxt', 'stept'];

document.addEventListener('DOMContentLoaded', function () {
    let form = document.getElementById("paramForm");
    form.addEventListener('submit',function(e){
        e.preventDefault();
        let paramDict = params.reduce((map, param) => {
            map[param] = document.getElementById(param).value;
            return map
        }, {});
        alert(JSON.stringify(paramDict));
    })
});