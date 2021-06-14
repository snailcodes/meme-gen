'use strict';

var KEY = 'memes';
var gMemes;
var gCurrMemeText;
var gCurrMemeLineNum;

function getMemes() {
	return gMemes;
}

function findMemeId(id) {
	return gMemes.find(function (meme) {
		return meme.imgID.toString() === id;
	});
}

function updateNewLine(id, centerPos) {
	var meme = findMemeId(id);
	var NumLine = meme.lines.length;
	clearFocus(id);
	var newline = {
		lineNum: NumLine++,
		isFocus: true,
		txt: 'text',
		isDrag: false,
		size: 20,
		align: 'center',
		color: '#000000',
		fillColor: '#FFFFFF',
		fontFam: 'Impact',
		pos: {
			x: centerPos.x,
			y: 250,
		},
		endpos: {
			x: centerPos.x + 20,
			y: 250 + 20,
		},
	};
	console.log(newline);
	meme.lines.push(newline);
	console.log(meme.lines);
}

function createMeme(imgNum) {
	return {
		imgID: imgNum,
		selectedLineIdx: 0,
		imgSrc: 'img/' + imgNum + '.jpg',
		lines: [
			{
				lineNum: 0,
				isFocus: false,
				txt: 'text',
				isDrag: false,
				size: 20,
				align: 'center',
				color: '#000000',
				fillColor: '#FFFFFF',
				fontFam: 'Impact',
				pos: {
					x: 130,
					y: 40,
				},
				endpos: {
					x: 130 + 20,
					y: 40 + 20,
				},
			},
		],
	};
}

function createMemes(centerPos) {
	var memes = loadFromStorage(KEY);
	if (!memes || !memes.length) {
		var memes = [];
		for (var i = 1; i < 19; i++) {
			// console.log(i);
			memes.push(createMeme(i, centerPos));
		}
	}

	gMemes = memes;
	console.log(gMemes);
	saveMemesToStorage();
}

function saveMemesToStorage() {
	saveToStorage(KEY, gMemes);
}

function removeLine(id, lineNum) {
	var meme = findMemeId(id);
	// meme.lines.splice(lineNum, 1);
	meme.lines[lineNum].txt = '';
}

//NOT CURR IN USE -  TO USE IF INCLUDE SEARCH
function displayMemes() {
	return gMemes;
}

function setCenter(id, lineNum, centerX) {
	var meme = findMemeId(id);
	meme.lines[lineNum].pos.x = centerX + meme.lines[lineNum].size / 2;
}

function setHeight(id, lineNum, centerY, maxY) {
	var meme = findMemeId(id);

	switch (lineNum) {
		case 0:
			meme.lines[lineNum].pos.y = meme.lines[lineNum].size;
			break;
		case 1:
			meme.lines[lineNum].pos.y = maxY - meme.lines[lineNum].size * 2;
			break;
		case 3:
			meme.lines[lineNum].pos.y = centerY;
			break;
		default:
			meme.lines[lineNum].pos.y =
				centerY + meme.lines[lineNum].size * lineNum;
			break;
	}
}

function updateMemeText(input, id, lineNum) {
	var meme = findMemeId(id);
	meme.lines[lineNum].txt = input;
}

function updateSize(id, lineNum, diff) {
	var meme = findMemeId(id);
	console.log(meme.lines);
	if (meme.lines[lineNum].size <= 0) return;
	meme.lines[lineNum].size += diff;
}

function updateFont(id, lineNum, value) {
	var meme = findMemeId(id);
	console.log(meme.lines);
	meme.lines[lineNum].fontFam = value;
	console.log(meme.lines[lineNum].fontFam);
}

function changeLineCol(id, lineNum, color) {
	var meme = findMemeId(id);
	meme.lines[lineNum].color = color;
}
function changeFillCol(id, lineNum, color) {
	var meme = findMemeId(id);
	console.log(meme);
	meme.lines[lineNum].fillColor = color;
	console.log(meme);
}

function changeAlign(id, lineNum, updatedAlign) {
	var meme = findMemeId(id);
	console.log(lineNum);
	// meme.lines[lineNum].pos.x = updatedAlign;
	console.log(meme.lines[lineNum]);
	meme.lines[lineNum].align = updatedAlign;
}

function getLineColor(memeId, lineNum) {
	var meme = findMemeId(memeId);
	return meme.lines[lineNum].color;
}

function getFillColor(memeId, lineNum) {
	var meme = findMemeId(memeId);
	return meme.lines[lineNum].fillColor;
}

function getText(memeId, lineNum) {
	var meme = findMemeId(memeId);
	if (!meme.lines[lineNum].txt) return;
	return meme.lines[lineNum].txt;
}

function getFont(memeId, lineNum) {
	var meme = findMemeId(memeId);
	return meme.lines[lineNum].fontFam;
}

function getAlign(memeId, lineNum) {
	var meme = findMemeId(memeId);
	return meme.lines[lineNum].align;
}

function getAllLines(memeId) {
	var meme = findMemeId(memeId);
	return meme.lines;
}

function getFontAlign(memeId, lineNum) {
	var meme = findMemeId(memeId);
	console.log('weird');
	// return meme.lines[lineNum].pos.x;
}

function getSize(memeId, lineNum) {
	var meme = findMemeId(memeId);
	return meme.lines[lineNum].size;
}

// found bug
function getPos(memeId, lineNum) {
	var meme = findMemeId(memeId);
	console.log('get pos', meme.lines[lineNum].pos);
	return meme.lines[lineNum].pos;
}

// function getTextObject(id) {
//     var meme = findMemeId(id);
//     gCurrMemeText = meme.lines[0];
//     // console.log(gCurrMemeText);
//     return meme.lines[0];
// }

function textClicked(clickedPos) {
	var id = getMeme();
	var meme = findMemeId(id);
	for (var i = 0; i < meme.lines.length; i++) {
		var xStart = meme.lines[i].border.x;
		var yStart = meme.lines[i].border.y;
		var xEnd = xStart + meme.lines[i].border.width;
		var yEnd = yStart + meme.lines[i].border.height;
		console.log(
			'curr pos is:',
			clickedPos.x,
			clickedPos.y,
			'line',
			i,
			'x start and end:',
			xStart,
			xEnd,
			'y start and end:',
			yStart,
			yEnd
		);

		if (
			clickedPos.x > xStart &&
			clickedPos.x < xEnd &&
			clickedPos.y > yStart &&
			clickedPos.y < yEnd
		) {
			meme.lines[i].isDrag = true;
			// meme.lines[i].isFocus = true;

			updateFocus(i);

			gCurrMemeText = meme.lines[i];
			gCurrMemeLineNum = i;

			return meme.lines[i];
		} else console.log('caugt nobody');
	}
}

function updateFocus(focusedLine) {
	var id = getMeme();
	var meme = findMemeId(id);
	for (var i = 0; i < meme.lines.length; i++) {
		meme.lines[i].isFocus = false;
	}
	meme.lines[focusedLine].isFocus = true;
}

function resetTextDrag() {
	var id = getMeme();
	var meme = findMemeId(id);
	for (var i = 0; i < meme.lines.length; i++) {
		meme.lines[i].isDrag = false;
	}
}

function moveText(dx, dy) {
	gCurrMemeText.pos.x += dx;
	gCurrMemeText.pos.y += dy;
}

function saveTxtBorder(x, y, width, height, lineNum, id) {
	// console.log(x, y, width, height, lineNum, id);
	var meme = findMemeId(id);
	meme.lines[lineNum].border = { x: x, y: y, width: width, height: height };
}

function getLatestLine(memeId) {
	var meme = findMemeId(memeId);
	return meme.lines.length - 1;
}

function isActive(memeId) {
	var meme = findMemeId(memeId);
	var lines = meme.lines;
	console.log(lines);
	return lines.find((line) => line.isFocus === true);
}

function clearFocus(memeId) {
	var meme = findMemeId(memeId);
	for (var i = 0; i < meme.lines.length; i++) meme.lines[i].isFocus = false;
}

function updateTextPos(memeId, pos) {
	var meme = findMemeId(memeId);
	var draggedLine = meme.lines.find((line) => line.isDrag);
	if (!draggedLine) return;
	draggedLine.pos.x = pos.x;
	draggedLine.pos.y = pos.y;
	console.log('draggedline', draggedLine.pos);
}
