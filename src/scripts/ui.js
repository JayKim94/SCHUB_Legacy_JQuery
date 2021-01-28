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
    this._appendUI('countdown');
    this._appendUI('score');
    this._appendUI('answer');
    this._setbuttonEvents();
    this._setGlobalHandlers();
}
UI.prototype._setGlobalHandlers = function() {
    $(document).on('resize', (e) => globals.canvas.draw());
}
UI.prototype._setbuttonEvents = function() {
    $('#start').on('click', () => {
        $('#menu').fadeOut();
        globals.game.start();
        // input event
        $(document).on('keydown', (e) => {
            const { key } = e;
            // Assess keycode
            if (this._isKeyInteger(key)) 
            {
                globals.game.write(key);
            }
            else if (this._isSubmit(key)) 
            {
                globals.game.submit();
            }
            else if (this._isClear(key)) 
            {
                this._erase();
            }
        });
    });
    $('#tutorial').on('click', () => {
        console.log('Tutorial');
    });
}
UI.prototype._appendUI = function(id) {
    $('#overlay_container').append(`<div id="${id}"></div>`);
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