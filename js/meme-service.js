'use strict';

var KEY = 'memes';
var gMemes;

createMemes();

function getMemes() {
    return gMemes;
}

function findMemeId(id) {
    return gMemes.find(function (meme) {
        return meme.imgID.toString() === id;
    });
}

function updateMemeText(input, id) {
    var meme = gMemes[id - 1];
    meme.lines[0].txt = input;
}

function createMeme(imgNum) {
    return {
        imgID: imgNum,
        selectedLineIdx: 0,
        imgSrc: 'img/' + imgNum + '.jpg',
        lines: [
            {
                txt: 'text',
                size: 20,
                align: 'center',
                color: 'white',
            },
        ],
    };
}

function createMemes() {
    var memes = loadFromStorage(KEY);
    if (!memes || !memes.length) {
        var memes = [];
        for (var i = 1; i < 19; i++) {
            console.log(i);
            memes.push(createMeme(i));
        }
    }
    gMemes = memes;
    saveMemesToStorage();
}

function saveMemesToStorage() {
    saveToStorage(KEY, gMemes);
}

function displayMemes() {
    return gMemes;
}

function drawText(memeId, x = 130, y = 50) {
    var meme = findMemeId(memeId);
    console.log(meme);
    var text = meme.lines[0].txt;
    console.log(text);
    gCtx.lineWidth = 2;
    // gCtx.strokeStyle = 'red'
    // gCtx.fillStyle = 'white'
    gCtx.font = '40px Impact';
    // gCtx.textAlign = 'center'
    gCtx.fillText(text, x, y);
    gCtx.strokeText(text, x, y);
}
