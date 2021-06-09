'use strict';

var KEY = 'memes';
var gMemes;
var gCurrMemeText;

createMemes();

function getMemes() {
    return gMemes;
}

function findMemeId(id) {
    return gMemes.find(function (meme) {
        return meme.imgID.toString() === id;
    });
}

function updateNewLine(id) {
    var meme = findMemeId(id);
    var newline = {
        txt: 'text',
        isDrag: false,
        size: 20,
        align: 'center',
        color: 'white',
        fillColor: 'blue',
        pos: {
            x: 125,
            y: 250,
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
                color: 'white',
                fillColor: 'blue',
                pos: {
                    x: 125,
                    y: 40,
                },
            },
        ],
    };
}

function createMemes() {
    var memes = loadFromStorage(KEY);
    if (!memes || !memes.length) {
        var memes = [];
        for (var i = 1; i < 19; i++) {
            // console.log(i);
            memes.push(createMeme(i));
        }
    }

    gMemes = memes;
    console.log(gMemes);
    saveMemesToStorage();
}

function saveMemesToStorage() {
    saveToStorage(KEY, gMemes);
}

function displayMemes() {
    return gMemes;
}

function updateMemeText(input, id, lineNum) {
    // var meme = gMemes[id - 1];
    var meme = findMemeId(id);
    meme.lines[lineNum].txt = input;
}

function increaseFont(id, lineNum) {
    var meme = findMemeId(id);
    meme.lines[lineNum].size++;
}
function decreaseFont(id, lineNum) {
    var meme = findMemeId(id);
    if (meme.lines[lineNum].size <= 0) return;
    meme.lines[lineNum].size--;
}

function changeLineCol(id, lineNum, color) {
    var meme = findMemeId(id);
    meme.lines[lineNum].color = color;
}
function changeFillCol(id, lineNum, color) {
    var meme = findMemeId(id);
    meme.lines[lineNum].fillColor = color;
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
    const { pos } = gCurrMemeText;
    const distance = Math.sqrt(
        (pos.x - clickedPos.x) ** 2 + (pos.y - clickedPos.y) ** 2
    );
    console.log(distance);
    return distance <= gCurrMemeText.size;
}

function setTextDrag(isDrag) {
    gCurrMemeText.isDrag = isDrag;
}

function moveText(dx, dy) {
    console.log(dx, dy);
    gCurrMemeText.pos.x += dx;
    gCurrMemeText.pos.y += dy;
    console.log(gCurrMemeText.pos.x);
    console.log(gCurrMemeText.pos.y);
}
