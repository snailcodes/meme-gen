'use strict';

var KEY = 'memes';
var gMemes;
var gCurrMemeText;

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
    var newline = {
        txt: 'text',
        isDrag: false,
        size: 20,
        align: 'center',
        color: '#000000',
        fillColor: '#FFFFFF',
        pos: {
            x: centerPos.x,
            y: 250,
        },
        endpos: {
            x: centerPos.x + 20,
            y: 250 + 20,
        },
    };
    meme.lines.push(newline);
}

function createMeme(imgNum) {
    return {
        imgID: imgNum,
        selectedLineIdx: 0,
        imgSrc: 'img/' + imgNum + '.jpg',
        lines: [
            {
                txt: 'text',
                isDrag: false,
                size: 20,
                align: 'center',
                color: '#000000',
                fillColor: '#FFFFFF',
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

function updatesLines(id, lineNum) {
    var meme = findMemeId(id);
    console.log(meme.lines);
    meme.lines.splice(lineNum, 1);
    console.log(meme.lines);
}

function displayMemes() {
    return gMemes;
}

function setCenter(id, lineNum, centerX) {
    var meme = findMemeId(id);
    meme.lines[lineNum].pos.x = centerX - meme.lines[lineNum].size;
}

function setHeight(id, lineNum, centerY, maxY) {
    var meme = findMemeId(id);
    switch (lineNum) {
        case '0':
            var newYPos = 0 + meme.lines[lineNum].size;
            meme.lines[lineNum].pos.y = newYPos;
            break;
        case '1':
            meme.lines[lineNum].pos.y = maxY - meme.lines[lineNum].size;
            break;
        default:
            console.log('sanity');
            meme.lines[lineNum].pos.y =
                centerY + meme.lines[lineNum].size * lineNum;
            break;
    }
}

function updateMemeText(input, id, lineNum) {
    // var meme = gMemes[id - 1];
    var meme = findMemeId(id);
    meme.lines[lineNum].txt = input;
}

function updateSize(id, lineNum, diff) {
    var meme = findMemeId(id);
    if (meme.lines[lineNum].size <= 0) return;
    meme.lines[lineNum].size += diff;
    console.log(meme.lines[lineNum].size);
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
    // meme.lines[lineNum].pos.x = updatedAlign;
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
    return meme.lines[lineNum].txt;
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

function getPos(memeId, lineNum) {
    var meme = findMemeId(memeId);
    return meme.lines[lineNum].pos;
}

function getTextObject(id) {
    var meme = findMemeId(id);
    gCurrMemeText = meme.lines[0];
    // console.log(gCurrMemeText);
    return meme.lines[0];
}

function isTextClicked(clickedPos) {
    var id = getMeme();
    var meme = findMemeId(id);
    for (var i = 0; i < meme.lines.length; i++) {
        var xStart = meme.lines[i].border.x;
        var yStart = meme.lines[i].border.y;
        var xEnd = xStart + meme.lines[i].border.width;
        var yEnd = yStart + meme.lines[i].border.height;
        // if (clickedPos.x < xStart || clickedPos.x > xEnd) break;
        // if (clickedPos.y < yStart || clickedPos.y > yEnd) break;

        if (
            clickedPos.x > xStart &&
            clickedPos.x < xEnd &&
            clickedPos.y > yStart &&
            clickedPos.y < yEnd
        ) {
            meme.lines[i].isDrag = true;
            return true;
        }
    }
}

function setTextDrag() {
    var id = getMeme();
    var meme = findMemeId(id);
    for (var i = 0; i < meme.lines.length; i++) {
        meme.lines[i].isDrag = false;
    }
    // gCurrMemeText.isDrag = isDrag;
}

function moveText(dx, dy) {
    gCurrMemeText.pos.x += dx;
    gCurrMemeText.pos.y += dy;
}

function saveTxtBorder(x, y, width, height, lineNum, id) {
    var meme = findMemeId(id);
    meme.lines[lineNum].border = { x: x, y: y, width: width, height: height };
}
