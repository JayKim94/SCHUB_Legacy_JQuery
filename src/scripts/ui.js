// ui.js
// UI definiert und verwaltet die Interaktion mit der Benutzeroberfläche.
// Bibliothek: jquery.js

// Jawoon Kim PBT3H19A
import $ from 'jquery';
import { AnimateScoreboard } from './animations.js';
import { Game } from './game.js';
import globals from './globals.js';
import RocketImage from '../resources/rocket.svg';
import LogoImage from '../resources/bib_transparent.png';
import ProgressSVG from '../resources/progress_circle.svg';

export function UI() {
    this.init();
}

UI.prototype.init = function() {
    this.isPaused = false;
    this.isDialogOpen = false;
    /*
     * initialisiert Timer
     */
    this.timerID = null;
    this.timeLimit = 60;
    this.timeLeft = 60;
    /*
     * initialisiert das Spiel
     */
    this._showIntroScreen();
    this.game = new Game();
    globals.ready = false;
}



//#region Screen Switches

UI.prototype._showIntroScreen = function() {
    /*
     * Startmenü mit Titel
     */
    this._widget({ tag: 'div', id: 'menu' })
        .append(this._widget({ tag: 'h1' }).text('SCHUB!'))
        .append(this._widget({ tag: 'p' }).text('Entwickelt von Jay Kim'))
        .append(this._widget({ tag: 'button', id: 'start' })
            .text('START')
            .on('click', () => this._onClickStart()))
        .append(this._widget({ tag: 'button', id: 'tutorial' })
            .text('TUTORIAL')
            .on('click', () => {}))
        .append(this._widget({ tag: 'img', id: 'bibLogo' })
                .attr('src', LogoImage)
                .on('click', () => {
                    window.open('https://www.bib.de/', '_blank')
                }))
        .appendTo('#spiel_body');
    /*
     * Rocket SVG + Flamme + Rauch
     */
    this._widget({ tag: 'div', id: 'rocket_container'})
        .append(this._widget({ tag: 'img', id: 'rocket' })
            .attr('src', RocketImage)
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
    this._widget({ tag: 'div', id: 'timer' })
        .append(this._widget({ tag: 'p', id: 'timer_num' }))
        .append(this._widget({ tag: 'p', id: 'timer_tag' }).text('Verbleibende Zeit'))
        .appendTo('#overlay_container');
    /*
     * Pause (oben rechts)
     */
    this._widget({tag: 'button', id: 'pause', className: 'in_game_ui' })
        .text('PAUSE')
        .on('click', (e) => this._onClickPause())
        .hide()
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
    $('.progress-ring').animate({opacity: 1});
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
        /*
         * Sperrt Events
         */
        globals.ready = false;
        /*
         * blendet das Quiz aus
         */
        $('.op').addClass('blurred');
        /*
         * baut Pause-Screen
         */
        this._widget({ tag: 'div', id: 'dialog' })
            .append(this._widget({ tag: 'h1', className: 'title-text' })
                .text('PAUSE'))
            .append(this._widget({ tag: 'button' }).text('WEITER')
                .on('click', () => {
                    /*
                     * setzt fort
                     */
                    $('#dialog').remove();
                    $('.op').removeClass('blurred');
                    this.isDialogOpen = false;
                    this.isPaused = false;
                    this.game.continue();
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
    $('#rocket_container').remove();
    /*
     * holt das Ergebnis der Runde
     */
    const { score, maxSpeed, quizCount, accuracy } = this.game.getResult();
    /*
     * verlangsamt den Hintergrund
     */
    globals.canvas.setVelocity({ x: 1 });
    /*
     * baut die Erde und Rakete
     */
    this._widget({ tag: 'div', id: 'earth_container', className: 'outro_ui' })
        .append(this._widget({ tag: 'div', id: 'rocket_orbit' })
            .append(this._widget({ tag: 'img', className: 'outro_ui' })
            .attr('src', RocketImage)
            .attr('alt', 'Rocket')
            .css({ width: '90px' }))
            .append(this._buildFlame()))
        .append(this._widget({ tag: 'div', id: 'earth' }))
        .css({ left: innerWidth + 300 })
        .appendTo('#overlay_container')
        .animate({ left: '50%' }, 40000, 'linear');
    /*  
     * zeigt die Anzeigetafel an (nach 3 Sekunden)
     */
    const delay = 0;
    setTimeout(() => {
        this._widget({ tag: 'div', id: 'menu', className: 'outro_ui' })
            .append(this._widget({ tag: 'h1' }).text('SCHUB!')
                .addClass('outro'))
            .append(this._widget({ tag: 'img', id: 'bibLogo' })
                .attr('src', LogoImage)
                .on('click', () => {
                    window.open('https://www.bib.de/', '_blank')
                }))
            .append(this._buildScoreboard())
            .append(this._widget({ tag: 'button', id: 'retryBtn' })
                .text('Retry')
                .on('click', () => this._onRetry() ))
            .hide()
            .appendTo('#spiel_body')
            .fadeIn(5000);
        AnimateScoreboard.numbers({target: '#finalScore', value: score });
        AnimateScoreboard.numbers({target: '#maxSpeed', value: maxSpeed });
        AnimateScoreboard.numbers({target: '#quizCount', value: quizCount });
        AnimateScoreboard.numbers({target: '#accuracy', value: accuracy });
    }, delay)
}

UI.prototype._buildScoreboard = function() {
    /*
     * baut Anzeigetafel
     */ 
    const board = this._widget({ tag: 'div', className: 'scoreboard' });
    const scores = this._widget({ tag: 'div', className: 'scores'});
    const scorebox_1 = this._widget({ tag: 'div', className: 'scorebox' });
    const scorebox_2 = this._widget({ tag: 'div', className: 'scorebox' });
    const scorebox_3 = this._widget({ tag: 'div', className: 'scorebox' });

    scorebox_1.append(this._widget({ tag: 'p', className: 'label' }).text('Treffsicherheit'));
    scorebox_1.append(this._widget({ tag: 'p', className: 'numbers', id: 'accuracy' }).text('0'));
    scorebox_2.append(this._widget({ tag: 'p', className: 'label' }).text('Max. Geschwindigkeit'));
    scorebox_2.append(this._widget({ tag: 'p', className: 'numbers', id: 'maxSpeed' }).text('0'));
    scorebox_3.append(this._widget({ tag: 'p', className: 'label' }).text('Gelöste Aufgaben'));
    scorebox_3.append(this._widget({ tag: 'p', className: 'numbers', id: 'quizCount' }).text('0'));
    
    scores.append(scorebox_1, scorebox_2, scorebox_3);

    board.append(this._widget({ tag: 'p', className: 'label', id: 'finalLabel' }).text('Erhaltene Punkte'));
    board.append(this._widget({ tag: 'p', className: 'numbers', id: 'finalScore' }).text('0'));
    board.append(scores);

    return board;
}

//#endregion

//#region Events

UI.prototype._startTimer = function() {
    /*
     * Interval-Event jede 1 Sekunde
     */
    const TICK = 1000;
    this.timerID = setInterval(() => {
        /*
         * läuft nicht, wenn pausiert
         */
        if (this.isPaused) return;
        /*
         * bis zum 0 Sek.
         */
        this.timeLeft--;
        if (this.timeLeft >= 0) 
        {
            $('#timer_num').text(`${this.timeLeft}`);
        }
        else 
        {
            globals.ready = false;
            $(document).off('keydown');
            $('.in_game_ui').fadeOut(2000, 'linear', () => {
                $('.in_game_ui').remove();
            });
            /*
             * entfernt Interval-Event
             */
           clearInterval(this.timerID);
           this.game.animateOutro();
           setTimeout(() => {
               $('#timer').fadeOut(1000, 'linear', () => $('#timer').remove()); 
               this._showOutroScreen();
            }, 5000);
        }
        /*
         * Warnung! ( unter 10 Sek. )
         */ 
        if (this.timeLeft <= 10) $('#timer').addClass('under-ten');
    }, TICK);
}

UI.prototype._onClickPause = function() {
    /*
     * Pause
     */
    this.isPaused = true;
    this._showPausedScreen();
    this.game.pause();
}

UI.prototype._onClickStart = function() {
    /*
     * wechselt die Szene
     */
    $('#menu').fadeOut(() => $('#menu').remove());
    this._showInGameScreen();
    this.timeLeft = this.timeLimit;
    $('#timer_num').text(`${this.timeLeft}`);
    /*
     * Eingabe-Event
     */
    $(document).on('keydown', (e) => this._onKeyDown(e));
    /*
     * stellt nötige Html-Elemente bereit
     */
    this._widget({ tag: 'div', id: 'countdown' })
        .appendTo('#overlay_container');
    this.game.ready();
    this._appendNextQuiz();
    this._buildCountdown();
}

UI.prototype._onSubmit = function() {
    if ($('#answer').text().length <= 0) return;

    const buffer = 1000;
    globals.ready = false;
    setTimeout(() => { globals.ready = true; }, buffer);

    const playerAnswer = $('#answer').text();
    const isCorrect = this.game.submit(playerAnswer);
    
    if (isCorrect)
    {
        $('answer').text('');
        this._appendNextQuiz();
        this.game.animateToNextQuiz();
    }
    else 
    {
        
    }
}

UI.prototype._onRetry = function() {
    $('.outro_ui').remove();
    this._showIntroScreen();
    this.game = new Game();
}

//#endregion

//#region Helpers

UI.prototype._appendNextQuiz = function() {
    this.game.getNextQuizMap().forEach((val, key) => 
    {
        this._widget({ tag: 'div', className: `op ${key} active` })
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
        this.game.hideBoost();
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
        if ($('#answer').text().length == 0) this.game.showBoost();
    }
}

UI.prototype._isValidToWrite = function(key) {
    return Number.isInteger(Number.parseInt(key)) &&
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


UI.prototype._buildCountdown = function() {
    /*
     * Countdown
     */
    const DELAY = 1000;
    const countdown = $('#countdown');
    setTimeout(() => { countdown.text('3').fadeIn(); }, DELAY);
    setTimeout(() => { countdown.text('2'); countdown.addClass('_2'); }, DELAY * 2);
    setTimeout(() => { countdown.text('1'); countdown.addClass('_1'); }, DELAY * 3);
    setTimeout(() => 
    { 
        countdown.remove();
        const fadeDuration = 1500;
        /*
         * zeigt die Pause-Taste an
         */
        $('#pause').show();
        /*
         * zeigt das Eingabefeld an
         */
        $('#answer_field').fadeIn(fadeDuration);
        /*
         * Timer
         */
        this._startTimer();
        /*
         * startet die Runde
         */
        this.game.start();
    }, DELAY * 4);
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