// ui.js
// UI definiert und verwaltet die Interaktion mit der Benutzeroberfläche.
// Bibliothek: jquery.js

// Jawoon Kim PBT3H19A
import $ from 'jquery';
import globals from './globals.js';

export function UI() {
    this.init();
}
UI.prototype.init = function() {
    $(window).on('resize', (e) => globals.canvas.init());
    this._appendUI('countdown', '');
    this._appendUI('score', '0');
    this._appendUI('answer', '');
    this._showIntroMenu();
}
UI.prototype._showIntroMenu = function() {
    const menu = 
        `<div id="menu">
            <h1>SCHUB!</h1>
            <p>Entwickelt von Jawoon Kim</p>
        </div>`;
    $(menu).appendTo('body');

    const startBtn = `<button id="start">START</button>`;
    $(startBtn).on('click', () => {
        this._startGame();
    }).appendTo('#menu');

    const tutorialBtn = `<button id="tutorial">TUTORIAL</button>`;
    $(tutorialBtn).on('click', () => {
        console.log('Tutorial');
    }).appendTo('#menu');
}
UI.prototype._startGame = function() {
    globals.game.start();

    const pauseBtn = `<button id="pause"></button>`;
    $(pauseBtn)
        .text('PAUSE')
        .on('click', (e) => {
            this._showPauseMenu();
            globals.canvas.setVelocity({x: 0})})
        .appendTo('#overlay_container');
    const scoreboard = `<div id="score"></div>`;
    $(scoreboard)
        .text('0')
        .appendTo('#overlay_container')
        .fadeIn(1000);
    $('#menu').fadeOut();
    $('.status').animate({opacity: .45}, 3000);

    this._listenForInput();
}
UI.prototype._showPauseMenu = function() {
    const pause = 
        `<div id="menu">
            <h1>PAUSED</h1>
        </div>`;
    $(pause).appendTo('body');
}
UI.prototype._listenForInput = function() {
    $(document).on('keydown', (e) => {
        const { key } = e;
        // Assess keycode
        if (this._isKeyInteger(key)) globals.game.write(key);
        else if (this._isSubmit(key)) globals.game.submit();
        else if (this._isClear(key)) this._erase();
    });
}
UI.prototype._appendUI = function(id, content) {
    $('#overlay_container').append(`<div id="${id}">${content}</div>`);
}
UI.prototype._isKeyInteger = function(key) {
    return Number.isInteger(Number.parseInt(key)); 
}
UI.prototype._isSubmit = function(key) {
    return key === 'Enter';
}
UI.prototype._isClear = function(key) {
    return key === 'Backspace';
}
UI.prototype._erase = function() {
    $('#answer').text(function(index, text) {
        return text.length > 0 ? text.substr(0, text.length - 1) : text;
    });
}