const NUM_EQUATIONS = 2;
const OPEN_PAREN_SVG = '<path d="M85 0 A61 101 0 0 0 85 186 L75 186 A75 101 0 0 1 75 0"></path>';
const CLOSED_PAREN_SVG = '<path d="M24 0 A61 101 0 0 1 24 186 L34 186 A75 101 0 0 0 34 0"></path>';

const MULTIPLY_SIGN = "·"
const MINUS_SIGN = "−"
const ZERO_WIDTH_SPACE = "​";

const OPEN_PAREN_CLASS = 'dcg-mq-scaled dcg-mq-bracket-l dcg-mq-paren';
const CLOSED_PAREN_CLASS = 'dcg-mq-scaled dcg-mq-bracket-r dcg-mq-paren';

const FRACTION_CLASS = "dcg-mq-fraction dcg-mq-non-leaf";
const NUMERATOR_CLASS = 'dcg-mq-numerator';
const DENOMINATOR_CLASS = 'dcg-mq-denominator'

let totalNum = 0;

const IS_MIDDLE_BRACKET = (item) => {
    if ((item.className == 'cg-mq-bracket-middle dcg-mq-non-leaf') || (item.className == 'dcg-mq-non-leaf dcg-mq-bracket-container')) {
        return true;
    }
    return false;
}

const interpretFraction = (element) => {
    let parts = Array.from(element.childNodes).map((item) => {return item.innerHTML}).slice(0,2);
    let currString = "((";
    currString += interpretParens(Array.from(parts[0].childNodes).map((item) => {return item.innerHTML}).join(''));
    currString+=")/(";
    currString += interpretParens(Array.from(parts[1].childNodes).map((item) => {return item.innerHTML}).join(''));
    currString+="))";
    return currString;
}

// startIdx is idx of corresponding opening paren
const getNextParenIdx = (elements, startIdx) => {
    // console.log(elements)
    numToPass = 0;
    for(let i = startIdx+1; i < elements.length; i+=1){
        if ((elements[i].className == OPEN_PAREN_CLASS) || (elements[i].innerHTML==OPEN_PAREN_SVG)) {
            numToPass += 1;
        }
        if ((elements[i].className == CLOSED_PAREN_CLASS) || (elements[i].innerHTML==CLOSED_PAREN_SVG)) {
            if (numToPass == 0){
                return i;
            }
            numToPass -= 1;
        }
    }
    console.log('UHOH');
    return -1;
}

const interpretParens = (elementStr) => {
    totalNum += 1;
    let currStr = "";  // output of everything between current parens
    let wrapper = document.createElement( `test${totalNum}` ); //create dummy element
    wrapper.innerHTML = elementStr; // set wrapper innerHTML to parenthesized elements to convert to Nodes
    let items = Array.from(wrapper.childNodes) // get HTML nodes of each top-level paren entry
    let itemIdx = 0;
    while (itemIdx < items.length){
        if (IS_MIDDLE_BRACKET(items[itemIdx])) {
            currStr += interpretParens(Array.from(items[itemIdx].childNodes).map((item) => {return item.innerHTML}).join(''));
            itemIdx += 1;
        }
        else if ((items[itemIdx].className == OPEN_PAREN_CLASS) || (items[itemIdx].innerHTML==OPEN_PAREN_SVG) ){
            currStr += '(';
            endIdx = getNextParenIdx(items, itemIdx);
            if (endIdx == -1) {
                alert('Desmos unmatched parens error')
                return;
            }
            currStr += interpretParens(items.slice(itemIdx+1,endIdx).map((item) => {return item.innerHTML}).join(''));
            currStr += ')';
            itemIdx += endIdx + 1;
        }
        else if (items[itemIdx].className == (NUMERATOR_CLASS)){
            currStr += "(("
            currStr += interpretParens(items.slice(itemIdx,itemIdx+1).map((item) => {return item.innerHTML}).join(''));
            currStr += ')/';
            itemIdx += 1;
        }
        else if (items[itemIdx].className == (DENOMINATOR_CLASS)){
            currStr += "("
            currStr += interpretParens(items.slice(itemIdx,itemIdx+1).map((item) => {return item.innerHTML}).join(''));
            currStr += '))';
            itemIdx += 1;
        }
        else {
            let currItem = items[itemIdx].textContent.replace(MULTIPLY_SIGN, " * ");
            currStr += currItem;
            itemIdx += 1;
        }
    }
    return currStr;
}

let elements = [];
const xpath = '//*[contains(concat( " ", @class, " " ), concat( " ", "dcg-mq-root-block", " " ))]';
var results = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
while (node = results.iterateNext()) {
    elements.push(node)
}

// gets first two equations from Desmos
elements = elements.slice(0, NUM_EQUATIONS);

let equations = elements.map((equation) => {
    let equationElements = Array.from(equation.children);
    equationList = equationElements.map((equationItem) => { 
        if (equationItem.innerHTML.includes(OPEN_PAREN_CLASS)) {
            return interpretParens(equationItem.innerHTML);
        }
        else if (equationItem.innerHTML.includes(CLOSED_PAREN_CLASS)) {
            return '('
        }
        else {
            return equationItem.innerHTML;
        }
    })
    return equationList.filter(x => x!="&nbsp;").join('').trim().replace(MULTIPLY_SIGN, " * ").replace(MINUS_SIGN, "-").replace(ZERO_WIDTH_SPACE, "");;
});


equationsDict = equations.reduce((map, equation) => {
    map[equation[0]] = equation;
    return map;
}, {});


// sends to background script
chrome.runtime.sendMessage({cmd: "addEquations", equations: JSON.stringify(equationsDict)});