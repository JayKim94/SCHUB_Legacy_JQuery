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
    this._showIntroMenu();
    globals.ready = true;
}

UI.prototype._showIntroMenu = function() {
    this._widget({ tag: 'div', id: 'menu' })
        .append(this._widget({ tag: 'h1' }).text('SCHUB!'))
        .append(this._widget({ tag: 'p' }).text('Entwickelt von Jawoon Kim'))
        .appendTo('body');

    this._widget({ tag: 'button', id: 'start' }).text('START')
        .on('click', () => this._onClickStart())
        .appendTo('#menu');

    this._widget({ tag: 'button', id: 'tutorial' }).text('TUTORIAL')
        .on('click', () => {})
        .appendTo('#menu');

    $('#rocket_container')
        .addClass('opening');
}

UI.prototype._onClickPause = function() {
    this._widget({ tag: 'div', id: 'menu' })
        .append(this._widget({ tag: 'h1' }).text('PAUSED'))
        .appendTo('body');

    globals.canvas.setVelocity({ x: 0 });
}

UI.prototype._onClickStart = function() {
    $('#menu').fadeOut(() => $('#menu').remove());
    $('#rocket_container').removeClass('opening').addClass('in_game');
    
    this._appendInGameUI();
    this._listenForInput();
    this._appendCurrentQuiz(globals.game);

    globals.game.start();
}

UI.prototype._appendInGameUI = function() {
    this._widget({ tag: 'div', id: 'score' })
        .appendTo('#overlay_container')
        .text('0');

    this._widget({ tag: 'div', id: 'timer' })
        .append(this._widget({ tag: 'p', id: 'timer_num' }))
        .append(this._widget({ tag: 'p', id: 'timer_tag' }).text('Verbleibende Zeit'))
        .appendTo('#overlay_container');

    this._widget({ tag: 'div', id: 'countdown' })
        .appendTo('#overlay_container');
    
    this._widget({ tag: 'div', id: 'answer' })
        .appendTo('#overlay_container');
    
    this._widget({tag: 'button', id: 'pause' })
        .appendTo('#overlay_container')
        .text('PAUSE')
        .on('click', (e) => this._onClickPause());
    
    this._widget({ tag: 'div', className: 'status' })
        .append(this._widget({ tag: 'span', id: 'speed'}).text('0'))
        .append(this._widget({ tag: 'span' }).text('.0km/s'))
        .appendTo('#rocket_container');
}

UI.prototype._listenForInput = function() {
    $(document).on('keydown', (e) => {
        const { key } = e;
        // Assess keycode
        if (this._isKeyInteger(key)) globals.game.write(key);
        else if (this._isSubmit(key)) this._onSubmit();
        else if (this._isClear(key)) this._erase();
    });
}

UI.prototype._onSubmit = function() {
    if (globals.game.submit()) {
        $('#answer').addClass('correct');
        setTimeout(() => {
            $('#answer').removeClass('correct').text('');
        }, 300);
        this._appendCurrentQuiz(globals.game);
        globals.game.next();
    }
    else {
        
    }
}

UI.prototype._appendCurrentQuiz = function(game) {
    game.getQuizMap().forEach((val, key) => 
    {
        this._widget({ tag: 'div', className: 'op active' })
            .addClass(key)
            .attr('value', val)
            .append(this._widget({ tag: 'span' }).text(val))
            .appendTo('#overlay_container');
    });
}

UI.prototype._isKeyInteger = function(key) {
    return Number.isInteger(Number.parseInt(key)); 
}

UI.prototype._isSubmit = function(key) {
    return key === 'Enter' && $('#answer').text().length > 0;
}

UI.prototype._isClear = function(key) {
    return key === 'Backspace';
}

UI.prototype._erase = function() {
    $('#answer').text(function(index, text) {
        return text.length > 0 ? text.substr(0, text.length - 1) : text;
    });
}

UI.prototype._widget = function({tag, id, className}) {
    return $(`<${tag} id="${id ?? ''}" class="${className ?? ''}"></${tag}>`);
}