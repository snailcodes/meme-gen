'use strict';

var gElCanvas;
var gCtx;
var gCurrMemeId;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];
var gStartPos;
var gCenter;
var gElMeme;
var gLineCounter = 1;
var gMemeImg;

function init() {
    createMemes();
    renderMemes();
}

function renderMemes() {
    var memes = getMemes();
    var strHTMLs = memes.map(
        (meme) => `<img
        onclick="memeEditor(this)"
        src="./img/${meme.imgID}.jpg"
        class="meme ${meme.imgID}"
    />`
    );

    document.querySelector('.gallery-grid').innerHTML = strHTMLs.join('');
}

//todo - consider renderCanvas???
function memeEditor(elMeme) {
    //Hiding gallery, showing editor
    var elSearch = document.querySelector('.search-bar');
    var elTagWords = document.querySelector('.tag-words');
    var elGallery = document.querySelector('.gallery-grid ');
    var elEditor = document.querySelector('.editor');
    var elContainer = document.querySelector('.canvas-container');

    // elSearch.classList.add('hidden');
    // elTagWords.classList.add('hidden');
    elGallery.classList.add('hidden');
    elEditor.classList.remove('hidden');
    elContainer.classList.remove('hidden');

    gElMeme = elMeme;
    gCurrMemeId = gElMeme.classList[1];

    gElCanvas = document.querySelector('.canvas');
    gCtx = gElCanvas.getContext('2d');
    resizeCanvas();
    gCenter = { x: gElCanvas.width / 2, y: gElCanvas.height / 2 };
    drawImgFromSameDomain();
    addListeners();
}

function renderCanvas() {
    // gCtx.save();
    drawImg();
    renderText();
    // gCtx.restore();
}

function drawImgFromSameDomain() {
    gMemeImg = new Image();
    gMemeImg.src = gElMeme.src;

    gMemeImg.onload = () => {
        gCtx.drawImage(gMemeImg, 0, 0, gElCanvas.width, gElCanvas.height);
    };
}

function drawImg() {
    if (gMemeImg)
        gCtx.drawImage(gMemeImg, 0, 0, gElCanvas.width, gElCanvas.height);
    else drawImgFromSameDomain();
}

function removeTextLine(ev) {
    var lineNum = getLineNum(ev);
    updatesLines(gCurrMemeId, lineNum);
    // renderText();
    renderCanvas();
}

function addTextLine() {
    var elTextSection = document.querySelector('.additional-lines');

    var strHTML = `<div class="text-line">
                        <form>
                            <input
                                placeholder="Enter Text"
                                type="text"
                                class="input-line-${gLineCounter}"
                                value=""
                            />
                            <input
                                onclick="addText(event,${gLineCounter})"
                                type="button"
                                value="Add Text"
                                class="input-btn-line-${gLineCounter}"
                            />
                        </form>
                        <button>↕</button>
                        <button onclick="addTextLine()">➕</button>
                        <button>❌</button>
                    </div>

                    <div class="editing-text">
                        <button class="increase-line-${gLineCounter}" onclick="onChangeFont(event,1)">⇑</button>
                        <button class="decrease-line-${gLineCounter}" onclick="onChangeFont(event,-1)">⇓</button>
                     
                        <input type="color"
                                onchange="onChangeLineColor(event)"
                                class="color-line-${gLineCounter}"
                                value="#000000">
                                🖌
                             </input>
                            <input type="color"
                                onchange="onChangeFillColor(event)"
                                class="bcgColor-line-${gLineCounter}"
                                value="#FFFFFF"
                            >
                                🎨
                        </input>
                    </div>`;

    gLineCounter++;
    updateNewLine(gCurrMemeId, gCenter);
    elTextSection.innerHTML += strHTML;
}

//   <button class="left-line-${gLineCounter}">⬅</button>
// {/* <button class="center-line-${gLineCounter}">↔</button> */}

/* <button class="right-line-${gLineCounter}" >➡</button> */

function getLineNum(ev) {
    var str = ev.target.classList;
    var str = str.toString();
    return str.split('-').pop();
}

function addText(ev) {
    ev.preventDefault();
    var lineNum = getLineNum(ev);
    var str = '.input-line-' + lineNum;
    var input = document.querySelector(str);

    setCenter(gCurrMemeId, lineNum, gCenter.x);
    setHeight(gCurrMemeId, lineNum, gCenter.y, gElCanvas.height);
    updateMemeText(input.value, gCurrMemeId, lineNum);

    renderCanvas();
    document.querySelector('.more-lines-controller').classList.remove('hidden');
}

function renderText() {
    var memeLines = getAllLines(gCurrMemeId);
    for (var i = 0; i < memeLines.length; i++) {
        var text = getText(gCurrMemeId, i);
        var pos = getPos(gCurrMemeId, i);
        var fontSize = getSize(gCurrMemeId, i);
        var fontFill = getFillColor(gCurrMemeId, i);
        var fontColor = getLineColor(gCurrMemeId, i);
        drawText(text, pos.x, pos.y, fontSize, fontFill, fontColor, i);
    }
}

function drawText(text, x, y, fontSize, fontFill, fontColor, idx) {
    var recHeight = fontSize + 5;
    recHeight = parseInt(recHeight);

    gCtx.lineWidth = 1;
    gCtx.strokeStyle = `${fontColor}`;
    gCtx.fillStyle = `${fontFill}`;

    fontSize += 'px';
    gCtx.font = `${fontSize}  Impact`;
    var recWidth = gCtx.measureText(text).width;
    gCtx.textBaseline = 'top';
    gCtx.strokeText(text, x, y);
    gCtx.fillText(text, x, y);
    saveTxtBorder(x, y, recWidth, recHeight, idx, gCurrMemeId);
    // drawTxtBorder(x, y, recWidth, recHeight, idx);
}

// function drawTxtBorder(x, y, width, height, idx) {
//     // gCtx.lineWidth = 0.5;
//     // gCtx.strokeStyle = 'black';
//     gCtx.strokeRect(x, y, width, height);
//     saveTxtBorder(x, y, width, height, idx, gCurrMemeId);
// }

function addListeners() {
    addMouseListeners();
    addTouchListeners();
    window.addEventListener('resize', () => {
        resizeCanvas();
    });
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove);
    gElCanvas.addEventListener('mousedown', onDown);
    gElCanvas.addEventListener('mouseup', onUp);
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove);
    gElCanvas.addEventListener('touchstart', onDown);
    gElCanvas.addEventListener('touchend', onUp);
}

function onDown(ev) {
    const pos = getEvPos(ev);

    if (!isTextClicked(pos)) return;

    // setTextDrag(true);
    gStartPos = pos;
    document.body.style.cursor = 'grabbing';
}

function onMove(ev) {
    var lineNum = getLineNum(ev);
    // console.log(lineNum);

    const text = getTextObject(gCurrMemeId, lineNum);
    if (text.isDrag) {
        const pos = getEvPos(ev);
        const dx = pos.x - gStartPos.x;
        const dy = pos.y - gStartPos.y;
        moveText(dx, dy);
        gStartPos = pos;
        renderCanvas();
    }
}

function onUp() {
    setTextDrag(false);
    document.body.style.cursor = 'grab';
}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    };
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault();
        ev = ev.changedTouches[0];
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        };
    }
    return pos;
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetHeight;
    drawImg();
}

function onChangeFont(ev, diff) {
    var lineNum = getLineNum(ev);
    updateSize(gCurrMemeId, lineNum, diff);
    renderCanvas();
}

function onChangeLineColor(ev) {
    var lineNum = getLineNum(ev);
    var className = '.color-line-' + lineNum;
    var lineColor = document.querySelector(className);
    // lineColor.addEventListener('input', updateValue);
    // lineColor.select();
    // console.log('line is', lineColor.value);
    changeLineCol(gCurrMemeId, lineNum, lineColor.value);
    renderCanvas();
}

function onChangeFillColor(ev) {
    var lineNum = getLineNum(ev);
    var className = '.bcgColor-line-' + lineNum;
    var fillColor = document.querySelector(className);
    // fillColor.addEventListener('input', updateValue);
    // fillColor.select();
    console.log('fill is', fillColor.value);
    changeFillCol(gCurrMemeId, lineNum, fillColor.value);
    renderCanvas();
}

function onRightAlign(ev) {
    var lineNum = getLineNum(ev);
    // changeAlign(gCurrMemeId, lineNum, 0);
    changeAlign(gCurrMemeId, lineNum, 'left');
    renderCanvas();
}
function onCenterAlign(ev) {
    var lineNum = getLineNum(ev);
    // changeAlign(gCurrMemeId, lineNum, gElCanvas.width / 2);
    changeAlign(gCurrMemeId, lineNum, 'center');
    renderCanvas();
}
function onLeftAlign(ev) {
    var lineNum = getLineNum(ev);
    // changeAlign(gCurrMemeId, lineNum, gElCanvas.width);
    changeAlign(gCurrMemeId, lineNum, 'right');
    // renderText();
    renderCanvas();
}

function getMeme() {
    return gCurrMemeId;
}

function downloadCanvas(elLink) {
    // ev.preventDefault();
    const data = gElCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my-meme.jpg';
}
