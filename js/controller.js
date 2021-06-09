'use strict';

var gCanvas;
var gCtx;
var gCurrMemeId;

function init() {
    renderMemes();
    displayMemes();
}

// console.log(findMemeId(4));
// console.log(findMemeBySrc('img/5.jpg'));
// console.log(findMemeBySrc('/img/6.jpg'));

function renderMemes() {
    var memes = getMemes();
    console.log(memes);
    var strHTMLs = memes.map(
        (meme) => `<img
        onclick="memeEditor(this)"
        src="img/${meme.imgID}.jpg"
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
}

function drawImgFromSameDomain(elMeme) {
    gCanvas = document.querySelector('.canvas');
    gCtx = gCanvas.getContext('2d');

    var img = new Image();
    img.src = elMeme.src;

    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
    };
}

function downloadCanvas(elLink) {
    const data = gCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my-img.jpg';
}

function addText(ev) {
    ev.preventDefault();
    var input = document.querySelector('.text-input');
    updateMemeText(input.value, gCurrMemeId);
    sendToPrint();
}

function sendToPrint() {
    drawText(gCurrMemeId);
}
