'use strict';

var gElCanvas;
var gCtx;
var gCurrMemeId;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];
var gStartPos;

function init() {
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

function memeEditor(elMeme) {
    var elSearch = document.querySelector('.search-bar');
    var elTagWords = document.querySelector('.tag-words');
    var elGallery = document.querySelector('.gallery-grid ');
    var elEditor = document.querySelector('.editor');

    elSearch.classList.add('hidden');
    elTagWords.classList.add('hidden');
    elGallery.classList.add('hidden');
    elEditor.classList.remove('hidden');

    gCurrMemeId = elMeme.classList[1];

    drawImgFromSameDomain(elMeme);
    addListeners();
}

function drawImgFromSameDomain(elMeme) {
    gElCanvas = document.querySelector('.canvas');
    gCtx = gElCanvas.getContext('2d');

    var img = new Image();
    img.src = elMeme.src;

    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
    };
}

function addTextLine() {
    var elTextSection = document.querySelector('.additional-lines');
    var lineCounter = 1;
    var strHTML = `<div class="text-line">
                        <form>
                            <input
                                placeholder="Enter Text"
                                type="text"
                                class="text-input line-${lineCounter}"
                                value=""
                            />
                            <input
                                onclick="addText(event,${lineCounter})"
                                type="button"
                                value="Add Text"
                                class="input-btn  line-${lineCounter}"
                            />
                        </form>
                        <button>↕</button>
                        <button onclick="addTextLine()">➕</button>
                        <button>❌</button>
                    </div>

                    <div class="editing-text">
                        <button class="line-${lineCounter}" onclick="onIncreaseFontSize(event)">⏫</button>
                        <button class="line-${lineCounter}""onclick="onDecreaseFontSize(event)">⏬</button>
                        <button class="line-${lineCounter}">⬅</button>
                        <button class="line-${lineCounter}">↔</button>
                        <button class="line-${lineCounter}" >➡</button>
                        <input type="color"
                                onchange="onChangeLineColor(event)"
                                class="color-line-0"
                                value="black">
                                🖌
                             </input>
                            <input type="color"
                                onchange="onChangeFillColor(event)"
                                class="bcgColor-line-0"
                                value="yellow"
                            >
                                🎨
                        </input>
                    </div>`;

    lineCounter++;
    updateNewLine(gCurrMemeId);
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
    var str = '.line-' + lineNum;
    console.log(str);
    var input = document.querySelector(str);
    console.log(input.value);
    updateMemeText(input.value, gCurrMemeId, lineNum);
    console.log(lineNum);
    renderText(lineNum);
}

//TODO - MOVING AND CHANGING ISSUE IS SOMEWHERE HERE
function renderText(lineNum) {
    var text = getText(gCurrMemeId, lineNum);
    var pos = getPos(gCurrMemeId, lineNum);

    var fontSize = fontSize === null ? '12' : getSize(gCurrMemeId, lineNum);
    var fontFill =
        fontFill === null ? 'white' : getFillColor(gCurrMemeId, lineNum);
    var fontColor =
        fontColor === null ? 'black' : getLineColor(gCurrMemeId, lineNum);

    console.log(fontColor);
    console.log(fontFill);

    gCtx.lineWidth = 2;
    gCtx.strokeStyle = `${fontColor}`;
    gCtx.fillStyle = `${fontFill}`;
    fontSize += 'px';
    gCtx.font = `${fontSize}  Impact`;
    // // gCtx.textAlign = 'center'
    gCtx.fillText(text, pos.x, pos.y);
    gCtx.strokeText(text, pos.x, pos.y);
}

function addListeners() {
    addMouseListeners();
    addTouchListeners();
    window.addEventListener('resize', () => {
        resizeCanvas();
        renderCanvas();
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

//TODO - BROKEN BECAUSE RENDERTEXT NOW NEEDS TO GET LINENUM
function renderCanvas() {
    gCtx.save();
    // var elMeme = findMemeId(gCurrMemeId);
    // console.log(elMeme);
    // drawImgFromSameDomain(elMeme);
    renderText();
    gCtx.restore();
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container');
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
