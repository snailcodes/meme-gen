'use strict';

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
}

function loadFromStorage(key) {
    var val = localStorage.getItem(key);
    return JSON.parse(val);
}

function updateAll(event) {
    document.querySelectorAll('p').forEach(function (p) {
        p.style.color = event.target.value;
    });
}
