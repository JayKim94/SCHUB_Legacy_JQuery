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

    this.isDialogOpen = false;
    this._showIntroScreen();

    globals.ready = false;
}

//#region Screen Switches

UI.prototype._showIntroScreen = function() {
    // Menu
    this._widget({ tag: 'div', id: 'menu' })
        .append(this._widget({ tag: 'h1' }).text('SCHUB!'))
        .append(this._widget({ tag: 'p' }).text('Entwickelt von Jawoon Kim'))
        .append(this._widget({ tag: 'button', id: 'start' })
            .text('START')
            .on('click', () => this._onClickStart()))
        .append(this._widget({ tag: 'button', id: 'tutorial' })
            .text('TUTORIAL')
            .on('click', () => this._showDialog()))
        .appendTo('body');
    // Rocket
    $('#rocket_container')
        .addClass('opening');
}

UI.prototype._showInGameScreen = function() {
    // Countdown (wird nach dem Start entfernt)
    this._widget({ tag: 'div', id: 'countdown' })
        .appendTo('#overlay_container');
    // Score
    this._widget({ tag: 'div', id: 'score' })
        .text('0')
        .appendTo('#overlay_container');
    const bottom_score = $('#score').offset().top + $('#score').outerHeight(true);
    const left_score = $('#score').offset().left;
    this._widget({ tag: 'div', id: 'added_score' })
        .css({top: bottom_score, left: left_score})
        .appendTo('#overlay_container')
        .hide();
    // Timer
    this._widget({ tag: 'div', id: 'timer' })
        .append(this._widget({ tag: 'p', id: 'timer_num' }))
        .append(this._widget({ tag: 'p', id: 'timer_tag' }).text('Verbleibende Zeit'))
        .appendTo('#overlay_container');
    // Eingabefeld
    this._widget({ tag: 'div', id: 'answer' })
        .appendTo('#overlay_container');
    // Pause
    this._widget({tag: 'button', id: 'pause' })
        .text('PAUSE')
        .on('click', (e) => this._onClickPause())
        .appendTo('#overlay_container');
    // Geschwindigkeit
    this._widget({ tag: 'div', className: 'status' })
        .append(this._widget({ tag: 'span', id: 'boost'}).text('0'))
        .css({opacity: 0})
        .appendTo('#overlay_container');
}

UI.prototype._showPausedScreen = function() {
    if (!this.isDialogOpen)
    {
        /* Sperrt Events */
        globals.ready = false;
        // blendet die Aufgabe aus
        $('.active').addClass('blurred');
        // baut Pause-screen
        this._widget({ tag: 'div', id: 'dialog' })
            .append(this._widget({ tag: 'h1', className: 'title-text' })
                .text('PAUSE'))
            // zum Fortfahren
            .append(this._widget({ tag: 'button' }).text('WEITER')
                .on('click', () => {
                    $('#dialog').remove();
                    this.isDialogOpen = false;
                    // setzt fort
                    $('.active').removeClass('blurred');
                    globals.game.continue();
                    globals.ready = true;
                }))
            .appendTo('body');

        this.isDialogOpen = true;
    }
    else
    {
        console.warn(`Es kann nicht mehr als ein Dialog geöffnet werden.`);
    }
}

//#endregion

//#region Events

UI.prototype._onClickPause = function() {
    this._showPausedScreen();
    globals.game.pause();
}

UI.prototype._onClickStart = function() {
    $(document).on('keydown', (e) => this._onKeyDown(e));
    $('#menu').fadeOut(() => $('#menu').remove());
    $('#rocket_container').removeClass('opening').addClass('in_game');
    this._showInGameScreen();
    this._appendNextQuiz();
    globals.game.startGame();
}

UI.prototype._onSubmit = function() {
    if ($('#answer').text().length <= 0) return;

    const playerAnswer = $('#answer').text();
    const isCorrect = globals.game.submit(playerAnswer);
    const correctEffect = { fontSize: '12rem', opacity: 0 };
    const reset = { fontSize: '8rem', opacity: 1 };

    if (isCorrect)
    {
        /* Sperrt Events */
        globals.ready = false;
        $('#added_score').fadeTo(1000, 0.5, () => { $('#added_score').fadeOut(1000); });
        setTimeout(() => {
            this._appendNextQuiz();
            globals.game.animateToNextQuiz();
            /* Wird wieder freigegeben */
            globals.ready = true;
        }, 300);
    }
    else 
    {
        
    }
}

//#endregion

//#region Helpers

UI.prototype._appendNextQuiz = function() {
    globals.game.getNextQuizMap().forEach((val, key) => 
    {
        this._widget({ tag: 'div', className: `op active ${key}` })
            .attr('value', val)
            .append(this._widget({ tag: 'span' }).text(val))
            .appendTo('#overlay_container');
    });
}

UI.prototype._onKeyDown = function(e) {
    if (!globals.ready) return;

    const { key } = e;
    if (this._isValidToWrite(key)) 
    {
        $('#answer').append(key);
    }
    else if (this._isSubmit(key)) 
    {
        this._onSubmit();
    }
    else if (this._isClear(key)) 
    {
        /* löscht die letzte Ziffer */
        $('#answer').text((index, text) => 
            (text.length > 0) ? text.substr(0, text.length - 1) : text);
    }
}

UI.prototype._isValidToWrite = function(key) {
    return Number.isInteger(Number.parseInt(key)) &&
        globals.ready &&
        !this.isDialogOpen &&
        $('#answer').text().length < 2;
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

UI.prototype._widget = function({tag, id, className}) {
    return $(`<${tag} id="${id ?? ''}" class="${className ?? ''}"></${tag}>`);
}

//#endregion