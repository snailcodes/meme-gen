'use strict';

var gElCanvas;
var gCtx;
var gCurrMemeId;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];
var gStartPos;
var gCenter;
var gElMeme;
var gLineCounter = 1;

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

    elSearch.classList.add('hidden');
    elTagWords.classList.add('hidden');
    elGallery.classList.add('hidden');
    elEditor.classList.remove('hidden');
    elContainer.classList.remove('hidden');

    gElMeme = elMeme;
    gCurrMemeId = gElMeme.classList[1];

    gElCanvas = document.querySelector('.canvas');
    gCtx = gElCanvas.getContext('2d');
    resizeCanvas();
    addListeners();

    drawImgFromSameDomain();
}

function drawImgFromSameDomain() {
    // gElCanvas = document.querySelector('.canvas');
    // gCtx = gElCanvas.getContext('2d');

    var img = new Image();
    img.src = gElMeme.src;

    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
    };
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
                        <button class="increase-line-${gLineCounter}" onclick="onIncreaseFontSize(event)">⏫</button>
                        <button class="decrease-line-${gLineCounter}""onclick="onDecreaseFontSize(event)">⏬</button>
                        <button class="left-line-${gLineCounter}">⬅</button>
                        <button class="center-line-${gLineCounter}">↔</button>
                        <button class="right-line-${gLineCounter}" >➡</button>
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
    gCenter = { x: gElCanvas.width / 2, y: gElCanvas.height / 2 };

    setCenter(gCurrMemeId, lineNum, gCenter.x);
    setHeight(gCurrMemeId, lineNum, gCenter.y, gElCanvas.height);
    updateMemeText(input.value, gCurrMemeId, lineNum);
    renderText(lineNum);
    document.querySelector('.more-lines-controller').classList.remove('hidden');
}

//TODO - MOVING AND CHANGING ISSUE IS SOMEWHERE HERE
function renderText(lineNum) {
    var text = getText(gCurrMemeId, lineNum);
    var pos = getPos(gCurrMemeId, lineNum);

    var fontSize = getSize(gCurrMemeId, lineNum);
    var fontFill = getFillColor(gCurrMemeId, lineNum);

    var fontColor = getLineColor(gCurrMemeId, lineNum);

    var fontAlign = getFontAlign(gCurrMemeId, lineNum);

    gCtx.lineWidth = 2;
    gCtx.strokeStyle = `${fontColor}`;
    gCtx.fillStyle = `${fontFill}`;
    fontSize += 'px';
    gCtx.font = `${fontSize}  Impact`;
    gCtx.textAlign = `${fontAlign}`;
    gCtx.fillText(text, pos.x, pos.y);
    gCtx.strokeText(text, pos.x, pos.y);
}

function addListeners() {
    addMouseListeners();
    addTouchListeners();
    window.addEventListener('resize', () => {
        resizeCanvas();
        drawImgFromSameDomain();
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
    setTextDrag(true);
    gStartPos = pos;
    console.log(gStartPos);
    document.body.style.cursor = 'grabbing';
}

function onMove(ev) {
    var lineNum = getLineNum(ev);

    const text = getTextObject(gCurrMemeId, lineNum);
    if (text.isDrag) {
        const pos = getEvPos(ev);
        const dx = pos.x - gStartPos.x;
        const dy = pos.y - gStartPos.y;
        moveText(dx, dy);
        gStartPos = pos;
        drawImgFromSameDomain();
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

//TODO - BROKEN BECAUSE RENDERTEXT NOW NEEDS TO GET LINENUM
//consider relationship between render text and render canvas??
// function renderCanvas() {
//     gCtx.save();
//     // var elMeme = findMemeId(gCurrMemeId);
//     // console.log(elMeme);
//     // drawImgFromSameDomain(elMeme);
//     renderText();
//     gCtx.restore();
// }

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetHeight;
}
function downloadCanvas(elLink) {
    const data = gElCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my-img.jpg';
}

function onIncreaseFontSize(ev) {
    var lineNum = getLineNum(ev);
    increaseFont(gCurrMemeId, lineNum);
    renderText(lineNum);
}

function onDecreaseFontSize(ev) {
    var lineNum = getLineNum(ev);
    decreaseFont(gCurrMemeId, lineNum);
    renderText(lineNum);
}

function onChangeLineColor(ev) {
    var lineNum = getLineNum(ev);
    var className = '.color-line-' + lineNum;
    var lineColor = document.querySelector(className);
    // lineColor.addEventListener('input', updateValue);
    // lineColor.select();
    console.log('line is', lineColor.value);
    changeLineCol(gCurrMemeId, lineNum, lineColor.value);
    renderText(lineNum);
}

function onChangeFillColor(ev) {
    var lineNum = getLineNum(ev);
    var className = '.bcgColor-line-' + lineNum;
    var fillColor = document.querySelector(className);
    // fillColor.addEventListener('input', updateValue);
    // fillColor.select();
    console.log(fillColor.value);
    changeFillCol(gCurrMemeId, lineNum, fillColor.value);
    renderText(lineNum);
}

function onRightAlign(ev) {
    var lineNum = getLineNum(ev);
    // changeAlign(gCurrMemeId, lineNum, 0);
    changeAlign(gCurrMemeId, lineNum, 'left');
    renderText(lineNum);
}
function onCenterAlign(ev) {
    var lineNum = getLineNum(ev);
    // changeAlign(gCurrMemeId, lineNum, gElCanvas.width / 2);
    changeAlign(gCurrMemeId, lineNum, 'center');
    renderText(lineNum);
}
function onLeftAlign(ev) {
    var lineNum = getLineNum(ev);
    // changeAlign(gCurrMemeId, lineNum, gElCanvas.width);
    changeAlign(gCurrMemeId, lineNum, 'right');
    renderText(lineNum);
}
