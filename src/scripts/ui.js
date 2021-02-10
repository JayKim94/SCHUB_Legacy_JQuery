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
    this.isDialogOpen = false;
    this._showIntroScreen();

    globals.ready = false;
}

//#region Screen Switches

UI.prototype._showIntroScreen = function() {
    /*
     * Startmenü mit Titel
     */
    this._widget({ tag: 'div', id: 'menu' })
        .append(this._widget({ tag: 'h1' }).text('SCHUB!'))
        .append(this._widget({ tag: 'p' }).text('Entwickelt von Jawoon Kim'))
        .append(this._widget({ tag: 'button', id: 'start' })
            .text('START')
            .on('click', () => this._onClickStart()))
        .append(this._widget({ tag: 'button', id: 'tutorial' })
            .text('TUTORIAL')
            .on('click', () => {}))
        .appendTo('#spiel_body');
    /*
     * Rocket SVG + Flamme + Rauch
     */
    this._widget({ tag: 'div', id: 'rocket_container'})
        .append(this._widget({ tag: 'img', id: 'rocket' })
            .attr('src', 'img/rocket.svg')
            .attr('alt', 'rocket'))
        .append(this._buildFlame())
        .append(this._widget({ tag: 'div', className: 'smoke_wrapper' })
            .append(this._buildSmoke()))
        .addClass('opening')
        .appendTo('#overlay_container');
}

UI.prototype._showInGameScreen = function() {
    /*
     * Punktzahl (oben links)
     */
    this._widget({ tag: 'div', id: 'score', className: 'in_game_ui' })
        .text('0')
        .appendTo('#overlay_container');
    const bottom_score = $('#score').offset().top + $('#score').outerHeight(true);
    const left_score = $('#score').offset().left;
    this._widget({ tag: 'div', className: 'added_score in_game_ui' })
        .css({top: bottom_score, left: left_score})
        .append(this._widget({ tag: 'span', id: 'increment' }))
        .append(this._widget({ tag: 'span', id: 'multiplier' }))
        .appendTo('#overlay_container');
    /*
     * Timer (oben mitte)
     */
    this._widget({ tag: 'div', id: 'timer', className: 'in_game_ui' })
        .append(this._widget({ tag: 'p', id: 'timer_num' }))
        .append(this._widget({ tag: 'p', id: 'timer_tag' }).text('Verbleibende Zeit'))
        .appendTo('#overlay_container');
    /*
     * Pause (oben rechts)
     */
    this._widget({tag: 'button', id: 'pause', className: 'in_game_ui' })
        .text('PAUSE')
        .on('click', (e) => this._onClickPause())
        .appendTo('#overlay_container');
    /*
     * Eingabefeld (mitte)
     */
    this._widget({ tag: 'div', id: 'answer_field', className: 'in_game_ui' })
        .append(this._widget({ tag: 'span', id: 'combo' }))
        .append(this._widget({ tag: 'div', id: 'circle' })
            .append(this._widget({ tag: 'span' }))
            .append(this._widget({ tag: 'span' }))
            .append(this._widget({ tag: 'span' }))
            .append(this._widget({ tag: 'span' })))
        .appendTo('#overlay_container');
    this._widget({ tag: 'div', id: 'answer', className: 'in_game_ui' })
        .appendTo('#overlay_container');
    /*
     * Status (unten mitte)
     */
    this._widget({ tag: 'div', className: 'status in_game_ui' })
        .append(this._widget({ tag: 'p', id: 'boostGauge' })
            .css({opacity: 0})
            .append(this._widget({ tag: 'span', id: 'boost'}).text('0'))
            .append(this._widget({ tag: 'span', className: 'percent' }).text('%')))
        .appendTo('#overlay_container');
    this._widget({ tag: 'div', id: 'boostLevel', className: 'in_game_ui' })
        .append(this._widget({ tag: 'div', id: 'levelText' }).text('STUFE 1'))
        .append(this._widget({ tag: 'div', id: 'currentSpeed' })
            .text('0'))
        .appendTo('#overlay_container');
}

UI.prototype._showPausedScreen = function() {
    if (!this.isDialogOpen)
    {
        /* Sperrt Events */
        globals.ready = false;
        // blendet die Aufgabe aus
        $('.op').addClass('blurred');
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
                    $('.op').removeClass('blurred');
                    globals.game.continue();
                    globals.ready = true;
                }))
            .appendTo('#spiel_body');

        this.isDialogOpen = true;
    }
    else
    {
        console.warn(`Es kann nicht mehr als ein Dialog geöffnet werden.`);
    }
}

UI.prototype._showOutroScreen = function() {
    this._widget({ tag: 'div', id: 'earth_container'})
        .append(this._widget({ tag: 'div', id: 'scoreboard' })
            .append(this._widget({ tag: 'p', id: 'final_score' })
                .html(`<span class='label'>SCORE</span>
                    <p class='number'>2500</p>`))
            .append(this._widget({ tag: 'p', id: 'final_speed' })
                .html(`<span class='label'>GESCHWINDIGKEIT</span>
                    <p class='number'>450 km/s</p>`)))
        .append(this._widget({ tag: 'div', id: 'rocket_orbit' })
            .append(this._widget({ tag: 'img' })
            .attr('src', 'img/rocket.svg')
            .attr('alt', 'Rocket')
            .css({ width: '90px' }))
            .append(this._buildFlame()))
        .append(this._widget({ tag: 'div', id: 'earth' }))
        .appendTo('#overlay_container');
}

//#endregion

//#region Events

UI.prototype._onClickPause = function() {
    this._showPausedScreen();
    globals.game.pause();
}

UI.prototype._onClickStart = function() {
    this._showInGameScreen();
    $('#menu').fadeOut(() => $('#menu').remove());
    $(document).on('keydown', (e) => this._onKeyDown(e));
    this._widget({ tag: 'div', id: 'countdown' })
        .appendTo('#overlay_container');
    this._appendNextQuiz();
    globals.game.startGame();
}

UI.prototype._onSubmit = function() {
    if ($('#answer').text().length <= 0) return;

    const buffer = 1000;
    globals.ready = false;
    setTimeout(() => { globals.ready = true; }, buffer);

    const playerAnswer = $('#answer').text();
    const isCorrect = globals.game.submit(playerAnswer);
    
    if (isCorrect)
    {
        $('answer').text('');
        this._appendNextQuiz();
        globals.game.animateToNextQuiz();
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
        this._widget({ tag: 'div', className: `op ${key} active in_game_ui` })
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
        globals.game.hideBoost();
    }
    else if (this._isSubmit(key)) 
    {
        this._onSubmit();
    }
    else if (this._isClear(key)) 
    {
        /*
         * löscht die letzte Ziffer
         */
        $('#answer').text((index, text) => 
            (text.length > 0) ? text.substr(0, text.length - 1) : text);
        /*
         * zeigt "Boost Gauge" an
         */
        if ($('#answer').text().length == 0) globals.game.showBoost();
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

UI.prototype._buildSmoke = function() {
    const smokeList = $(`<ul class="smoke"></ul>`);
    for (let i = 0; i < 9; i++) 
    {
        smokeList.append($(`<li></li>`));
    }
    return smokeList;
}

UI.prototype._buildFlame = function() {
    return this._widget({ tag: 'div', className: 'flame_wrapper' })
        .append(this._widget({ tag:'div', className: 'flame red' }))
        .append(this._widget({ tag:'div', className: 'flame orange' }))
        .append(this._widget({ tag:'div', className: 'flame gold' }))
        .append(this._widget({ tag:'div', className: 'flame white' }))
}

UI.prototype._widget = function({tag, id, className}) {
    return $(`<${tag} id="${id ?? ''}" class="${className ?? ''}"></${tag}>`);
}

//#endregion