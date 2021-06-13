'use strict';

//TODO - GO OVER GLOBALS AND SEE WHICH IS NOT NEEDED
var gElCanvas;
var gCtx;
var gCurrMemeId;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];
var gStartPos;
var gCenter;
var gElMeme;
// var gLineCounter = 1;
var gMemeImg;
var gTextOb;

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

	document.querySelector('.memes').innerHTML = strHTMLs.join('');
}

function memeEditor(elMeme) {
	//Hiding gallery, showing editor

	var elGallery = document.querySelector('.gallery-grid ');
	var elEditor = document.querySelector('.editor');
	var elContainer = document.querySelector('.canvas-container');
	var elHome = document.querySelector('.home-link');

	elGallery.classList.add('hidden');
	elEditor.classList.remove('hidden');
	elContainer.classList.remove('hidden');
	elHome.classList.remove('hidden');

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

function onRemoveTextLine(ev) {
	var lineNum = getLineNum(ev);
	removeLine(gCurrMemeId, lineNum);
	renderCanvas();
	// var str = '.text-line-input-' + lineNum;
	// var elControlLine = document.querySelector(str);
	// console.log(elControlLine)
	// elControlLine.classList.add('hidden');
}

// function addTextLine() {
// 	var elTextSection = document.querySelector('.additional-lines');

// 	var strHTML = `<div class="text-line text-line-input-${gLineCounter}">
//                         <form>
//                             <input
//                                 placeholder="Enter Text"
//                                 type="text"
//                                 class="input-line-${gLineCounter}"
//                                 value=""
//                             />
//                             <input
//                                 onclick="addText(event,${gLineCounter})"
//                                 type="button"
//                                 value="Add Text"
//                                 class="input-btn-line-${gLineCounter}"
//                             />
//                         </form>

//                         <div class="more-lines-controller flex ">
//                         <button onclick="addTextLine()"><span class="material-icons">add</span></button>
//                         <button onclick="onRemoveTextLine(event)"><span class="material-icons delete-input-${gLineCounter}">delete</span></button>
//                         </div>

//                     <div class="editing-text">
//                     <select name="fonts-select" class="input-line-${gLineCounter}" onchange="onChangeFont(event,value)">
//                         <option value="Impact" selected="selected">Impact</option>
//                         <option value="Arial">Ariel</option>
//                         <option value="Montserrat">Montserrat</option>
//                         <option value="Comic Sans MS">Comic Sans MS</option>
//                         <option value="Segoe Script ">Segoe Script </option>
//                     </select>
//                         <button class="increase-line-${gLineCounter}" onclick="onChangeSize(event,1)">⇑</button>
//                         <button class="decrease-line-${gLineCounter}" onclick="onChangeSize(event,-1)">⇓</button>

//                         <input type="color"
//                                 onchange="onChangeLineColor(event)"
//                                 class="color-line-${gLineCounter}"
//                                 value="#000000">
//                                 <span class="material-icons">
//                                 border_color
//                             </span>
//                              </input>
//                             <input type="color"
//                                 onchange="onChangeFillColor(event)"
//                                 class="bcgColor-line-${gLineCounter}"
//                                 value="#FFFFFF"
//                             >
//                             <span class="material-icons">
//                             format_color_fill
//                         </span>
//                         </input>

//                         <div class="align-text">
//                         <button class="left-line-${gLineCounter}" onclick="onLeftAlign(event)"><span class="material-icons left-line-${gLineCounter}">
//                         format_align_left
//                     </span></button>
//                         <button class="center-line-${gLineCounter}" onclick="onCenterAlign(event)"><span class="material-icons center-line-${gLineCounter}">
//                         format_align_center
//                     </span></button>
//                         <button class="right-line-${gLineCounter}" onclick="onRightAlign(event)"><span class="material-icons right-line-${gLineCounter}">
//                         format_align_right
//                     </span></button>
//                         </div>

//                         </div>
//                     </div>`;

// 	gLineCounter++;
// 	updateNewLine(gCurrMemeId, gCenter);
// 	elTextSection.innerHTML += strHTML;
// }

function getMeme() {
	return gCurrMemeId;
}

function getLineNum(ev) {
	var str = ev.target.classList;
	var str = str.toString();
	return str.split('-').pop();
}

function preventE(ev) {
	if (ev.keyCode === 13) {
		ev.preventDefault();
		addText(ev);
	}
}

// function addText(ev) {
// 	var lineNum = getLineNum(ev);
// 	var str = '.input-line-' + lineNum;
// 	var btnStr = '.input-btn-line-' + lineNum;
// 	var input = document.querySelector(str);
// 	var btn = document.querySelector(btnStr);

// 	setCenter(gCurrMemeId, lineNum, gCenter.x);
// 	setHeight(gCurrMemeId, lineNum, gCenter.y, gElCanvas.height);
// 	updateMemeText(input.value, gCurrMemeId, lineNum);

// 	renderCanvas();
// 	document.querySelector('.more-lines-controller').classList.remove('hidden');
// 	btn.value = 'Update Text';
// }

function addLine() {
	var input = document.querySelector('.input-line');
	input.value = 'Enter Text';
	console.log(input);
	input.placeholder = 'Enter Text';

	updateNewLine(gCurrMemeId, gCenter);
}

function addText() {
	var lineNum = getLatestLine(gCurrMemeId);
	updateFocus(lineNum);
	// if (currLine === 0)

	var input = document.querySelector('.input-line');

	//check - setcenter and setHeight do not work
	setCenter(gCurrMemeId, lineNum, gCenter.x);
	setHeight(gCurrMemeId, lineNum, gCenter.y, gElCanvas.height);
	updateMemeText(input.value, gCurrMemeId, lineNum);

	renderCanvas();
	document.querySelector('.more-lines-controller').classList.remove('hidden');
	// btn.value = 'Update Text';
}

function renderText() {
	var memeLines = getAllLines(gCurrMemeId);
	for (var i = 0; i < memeLines.length; i++) {
		var text = getText(gCurrMemeId, i);
		var pos = getPos(gCurrMemeId, i);
		var fontSize = getSize(gCurrMemeId, i);
		var fontFill = getFillColor(gCurrMemeId, i);
		var fontColor = getLineColor(gCurrMemeId, i);
		var fontFam = getFont(gCurrMemeId, i);
		var align = getAlign(gCurrMemeId, i);
		drawText(
			text,
			pos.x,
			pos.y,
			fontSize,
			fontFill,
			fontColor,
			fontFam,
			align,
			i
		);
	}
}

function drawText(
	text,
	x,
	y,
	fontSize,
	fontFill,
	fontColor,
	fontFam,
	align,
	idx
) {
	var recHeight = fontSize * 3;
	recHeight = parseInt(recHeight);
	gCtx.lineWidth = 1;
	gCtx.strokeStyle = `${fontColor}`;
	gCtx.fillStyle = `${fontFill}`;
	gCtx.textAlign = `${align}`;

	fontSize += 'px';
	gCtx.font = `${fontSize}  ${fontFam}`;
	var recWidth = gCtx.measureText(text).width;
	gCtx.textBaseline = 'top';
	gCtx.strokeText(text, x, y);
	gCtx.fillText(text, x, y);
	saveTxtBorder(x, y, recWidth, recHeight, idx, gCurrMemeId);
}

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

	gTextOb = textClicked(pos);
	if (!gTextOb) return;
	console.log(gTextOb);
	gStartPos = pos;

	document.body.style.cursor = 'grabbing';
}

function onMove(ev) {
	if (!gTextOb) return;
	if (gTextOb.isDrag) {
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

function onChangeSize(diff) {
	var activeLine = isActive(gCurrMemeId);
	// console.log(activeLine);
	console.log(gCurrMemeId, activeLine.lineNum, diff);
	updateSize(gCurrMemeId, activeLine.lineNum, diff);
	renderCanvas();
}

function onChangeFont(value) {
	// var lineNum = getLineNum(ev);
	var activeLine = isActive(gCurrMemeId);
	// console.log(activeLine);
	updateFont(gCurrMemeId, activeLine.lineNum, value);
	renderCanvas();
}

function onChangeLineColor() {
	// var lineNum = getLineNum(ev);
	var activeLine = isActive(gCurrMemeId);

	// var className = '.color-line-' + lineNum;
	var lineColor = document.querySelector('.color-line');
	changeLineCol(gCurrMemeId, activeLine.lineNum, lineColor.value);
	renderCanvas();
}

function onChangeFillColor() {
	// var lineNum = getLineNum(ev);
	var activeLine = isActive(gCurrMemeId);

	// var className = '.bcgColor-line-' + lineNum;
	var fillColor = document.querySelector('.bcgColor-line');
	changeFillCol(gCurrMemeId, activeLine.lineNum, fillColor.value);
	renderCanvas();
}

function onRightAlign() {
	var activeLine = isActive(gCurrMemeId);
	// var lineNum = getLineNum(ev);
	changeAlign(gCurrMemeId, activeLine.lineNum, 'left');
	renderCanvas();
}
function onCenterAlign() {
	var activeLine = isActive(gCurrMemeId);

	// var lineNum = getLineNum(ev);
	changeAlign(gCurrMemeId, activeLine.lineNum, 'center');
	renderCanvas();
}
function onLeftAlign() {
	var activeLine = isActive(gCurrMemeId);

	// var lineNum = getLineNum(ev);
	changeAlign(gCurrMemeId, activeLine.lineNum, 'right');
	renderCanvas();
}

function downloadCanvas(elLink) {
	// ev.preventDefault();
	const data = gElCanvas.toDataURL();
	elLink.href = data;
	elLink.download = 'my-meme.jpg';
}

//MOVES BACK TO GALLERY
function toGallery() {
	var elGallery = document.querySelector('.gallery-grid ');
	var elEditor = document.querySelector('.editor');
	var elContainer = document.querySelector('.canvas-container');
	var elHome = document.querySelector('.home-link');

	elContainer.classList.add('hidden');
	elEditor.classList.add('hidden');
	elGallery.classList.remove('hidden');
	elHome.classList.add('hidden');
}

function onImgInput(ev) {
	loadImageFromInput(ev, renderImg);
}

function renderImg(img) {
	gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
}

function loadImageFromInput(ev, onImageReady) {
	document.querySelector('.share-container').innerHTML = '';
	var reader = new FileReader();

	reader.onload = function (event) {
		var img = new Image();
		img.onload = onImageReady.bind(null, img);
		img.src = event.target.result;
	};
	reader.readAsDataURL(ev.target.files[0]);
}
