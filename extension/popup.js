function getElementByXpath(doc, path) {
    alert(doc)
    return doc.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}


// function test() {
//     alert( getElementByXpath('//*[contains(concat( " ", @class, " " ), concat( " ", "dcg-mq-root-block", " " ))]') );
// }

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // console.log("J'ai bien reçu un truc");
    // console.log(request);
    // console.log(sender);
    alert('hi');
}
);

document.addEventListener('DOMContentLoaded', function() {
    var checkPageButton = document.getElementById('checkPage');
    //*[contains(concat( " ", @class, " " ), concat( " ", "dcg-mq-root-block", " " ))]
    checkPageButton.addEventListener('click', function() {
        chrome.tabs.getSelected(null, function(tab) {
            d = document;
            
            // var f = d.createElement('form');
            // f.action = 'http://gtmetrix.com/analyze.html?bm';
            // f.method = 'post';
            // var i = d.createElement('input');
            // i.type = 'hidden';
            // i.name = 'url';
            // i.value = tab.url;
            // f.appendChild(i);
            // d.body.appendChild(f);
            // f.submit();
            alert( getElementByXpath(d,'//nobr') );
        });
    }, false);
  }, false);