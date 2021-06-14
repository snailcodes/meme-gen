'use strict';

var gElCanvas;
var gCtx;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];

var gCurrMemeId;
var gStartPos;
var gCenter;
var gMemeClassId;
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

	gMemeClassId = elMeme;
	gCurrMemeId = gMemeClassId.classList[1];
	// console.log(gMemeClassId, gCurrMemeId);
	gElCanvas = document.querySelector('.canvas');
	gCtx = gElCanvas.getContext('2d');
	gCenter = { x: gElCanvas.width / 2, y: gElCanvas.height / 2 };
	resizeCanvas();
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
	gMemeImg.src = gMemeClassId.src;

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
		addText();
	}
}

function addLine() {
	var input = document.querySelector('.input-line');
	var addInputBtn = document.querySelector('.input-btn');
	addInputBtn.value = 'Add Text';
	// input.value = 'Enter Text';
	console.log(input);
	input.placeholder = 'Enter Text';

	updateNewLine(gCurrMemeId, gCenter);
}

function addText() {
	var inputBtn = document.querySelector('.input-btn');
	var input = document.querySelector('.input-line');

	var lineNum = getLatestLine(gCurrMemeId);
	console.log(inputBtn.value);
	if (inputBtn.value === 'Add Text') {
		console.log('sanity');
		setCenter(gCurrMemeId, lineNum, gCenter.x);
		setHeight(gCurrMemeId, lineNum, gCenter.y, gElCanvas.height);
	}
	inputBtn.value = 'Update Text';

	updateFocus(lineNum);
	updateMemeText(input.value, gCurrMemeId, lineNum);

	renderCanvas();
	input.value = '';

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
		console.log('render pox', pos);
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
	var recHeight = fontSize;
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
	console.log('hand:', gStartPos, pos);
	gStartPos = pos;
	var inputBtn = document.querySelector('.input-btn');
	inputBtn.value = 'Update Text';

	document.body.style.cursor = 'grabbing';
}

function onMove(ev) {
	if (!gTextOb) return;
	if (gTextOb.isDrag) {
		const pos = getEvPos(ev);
		const dx = pos.x - gStartPos.x;
		const dy = pos.y - gStartPos.y;
		console.log(dx, dy);
		moveText(dx, dy);
		gStartPos = pos;
		renderCanvas();
	}
}

function onUp(ev) {
	const pos = getEvPos(ev);
	console.log(pos);
	updateTextPos(gCurrMemeId, pos);
	resetTextDrag(false);
	document.body.style.cursor = 'grab';
	renderCanvas();
}

function getEvPos(ev) {
	var pos = {
		x: ev.offsetX,
		y: ev.offsetY,
	};
	console.log('offsetpos', pos);
	if (gTouchEvs.includes(ev.type)) {
		ev.preventDefault();
		ev = ev.changedTouches[0];
		pos = {
			x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
			y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
		};
		console.log('thispos', pos);
	}
	return pos;
}

function resizeCanvas() {
	var elContainer = document.querySelector('.canvas-container');

	var size = elContainer.offsetWidth;
	gElCanvas.width = size;
	gElCanvas.height = size;
	drawImg();
}

function onChangeSize(diff) {
	var activeLine = isActive(gCurrMemeId);
	if (!activeLine) return;
	// console.log(activeLine);
	// console.log(activeLine);
	// console.log(gCurrMemeId, activeLine.lineNum, diff);
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

// function onImgInput(ev) {
// 	loadImageFromInput(ev, renderImg);
// }

// function renderImg(img) {
// 	console.log('drawing', gElCanvas.width, gElCanvas.height);
// 	gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
// }

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
