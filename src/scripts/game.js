// game.js
// Game definiert die Spiellogik / verwaltet Animationen.
// Bibliothek: jquery.js

// Jawoon Kim PBT3H19A
import $ from 'jquery';
import globals from './globals.js';

import { AnimateRocket, AnimateQuiz, AnimateUI } from './animations.js';
import { Quiz } from './models/quiz.js';

//#region Constructor

export function Game() {
    this.currentQuiz;
    this.init();
}

Game.prototype.init = function() {
    this.isReady = false;
    this.isPaused = false;
    this.score = 0;
    this.rocketSpeed = 0;
    this.combo = 0;
    this.highestCombo = 0;
    this.boostGauge = 0;
    this.boostLevel = 1;
    this.openingAnimation = AnimateRocket.openingSequence();
    this.floatingAnimations = [];
}

//#endregion

//#region Methoden

Game.prototype.startGame = function() {
    this.openingAnimation.pause();
    /*
     * initialisiert Timer
     */
    this.timeLeft = 60;
    $('#timer_num').text(`${this.timeLeft}`);
    /*
     * setzt Rotation zurück
     */
    globals.canvas.resetRotation();
    globals.canvas.setBackgroundAlpha(0.55);
    /*
     * zur Start-position
     */
    AnimateRocket.start();
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
        /*
         * zeigt das Eingabefeld an
         */
        $('#answer_field').fadeIn(1500);
        /*
         * startet die Runde
         */
        this._startTimer();
        AnimateQuiz.next();
        globals.canvas.setVelocity({ x: 10 });
        globals.ready = true;
    }, DELAY * 4);
}

Game.prototype.submit = function(playerAnswer) {
    const isCorrect = (playerAnswer === this.currentQuiz.answer().toString());
    /*
     * berechnet die erhaltene Punktzahl
     */
    let deltaBoost, deltaScore;
    if (isCorrect)
    {
        const score_base = 100;
        const score_combo = (Math.pow(this.combo, 2) * 100);
        const score_speed = Math.floor(this.rocketSpeed / 100) * 125; 

        deltaBoost = this.boostLevel < 2 ? 40 : 10;
        deltaScore = score_base + score_combo + score_speed;
    }
    else
    {
        deltaBoost = 0;
        deltaScore = 0;
    }
    /*
     * aktualisiert und animiert entsprechend
     */
    this._updateCombo(isCorrect);
    this._updateScore(deltaScore);
    this._updateBoost(deltaBoost);
    /*
     * animiert UI und Rocket
     */
    if (isCorrect) 
    {
        AnimateUI.correct(); 
        AnimateRocket.flame();
        AnimateRocket.smoke(0);
        this.showBoost();
        /*
         * markiert das Quiz für anschließenden Animationen
         */
        $('.active').removeClass('active').addClass('cleared');
    }
    else 
    {
        AnimateUI.wrong();
        AnimateRocket.smoke(.5);
        this.hideBoost();
    }
    if (this.boostLevel > 1 && this.floatingAnimations.length == 0)
    {
        this.floatingAnimations.push(AnimateRocket.float_vertical());
        this.floatingAnimations.push(AnimateRocket.float_horizontal());
    }

    /*
     * weiter mit UI-Interaktion
     */
    return isCorrect;
}

Game.prototype.pause = function() {
    /*
     * pausiert das Spiel
     */
    this.isPaused = true;
    this.floatingAnimations.forEach(anim => anim.pause());
    globals.canvas.setVelocity({ x: 0 })
}

Game.prototype.continue = function() {
    /*
     * setzt das Spiel fort
     */
    this.isPaused = false;
    this.floatingAnimations.forEach(anim => anim.play());
    globals.canvas.setVelocity({ x: this.rocketSpeed });
}

Game.prototype.animateToNextQuiz = function() {
    /*
     * sperrt UI bis das Ende der Animationen
     */
    globals.ready = false;
    setTimeout(() => {
        AnimateQuiz.clear();
        AnimateQuiz.next();
        globals.ready = true;
    }, 300);
}

Game.prototype.getNextQuizMap = function() {
    /*
     * holt Information fürs nächste Quiz
     */
    if (this.currentQuiz == null) 
    {
        this.currentQuiz = new Quiz();
    }
    else
    {
        this.currentQuiz.next();
    }
    return this.currentQuiz.currentMap();
}

Game.prototype.showBoost = function () {
    /*
     * blendet auf dem Antwortfeld in Prozent ein
     */
    const baseOpacity = 0.05;
    const addedOpacity = baseOpacity + (this.boostGauge / 500);
    $('#boostGauge').fadeTo(300, addedOpacity);
}

Game.prototype.hideBoost = function () {
    /*
     * blendet aus dem Antwortfeld aus
     */
    $('#boostGauge').fadeTo(150, 0.0);
}

//#endregion

//#region Helper-Funktionen

Game.prototype._startTimer = function() {
    /*
     * Interval-Event jede 1 Sekunde
     */
    const TICK = 1000;
    setInterval(() => {
        /*
         * läuft nicht, wenn pausiert
         */
        if (this.isPaused) return;
        /*
         * bis zum 0 Sek.
         */
        this.timeLeft--;
        if (this.timeLeft > 0) 
        {
            $('#timer_num').text(`${this.timeLeft}`);
        }
        else 
        {
            $('.in_game_ui').fadeOut(3000);
        }
        /*
         * Warnung! ( unter 10 Sek. )
         */ 
        if (this.timeLeft <= 10) $('#timer').addClass('under-ten');
    }, TICK);
}

Game.prototype._updateScore = function(score) {
    const prev = this.score;
    this.score += score;
    
    if (this.boostLevel > 1) $('#levelText').text(`STUFE ${this.boostLevel}`);

    /*
     * Score-bezogene Animationen
     */
    AnimateUI.score({prev, curr: this.score});
    AnimateUI.increment(score);
}

Game.prototype._updateCombo = function(isCorrect) {
    if (isCorrect) 
    {
        this.combo++;
    }
    else 
    {
        this.combo = 0;
    }
    /*
     * Effekte nur ab 3. Combo
     */
    if (this.combo > 2)
    {
        if (this.combo > this.highestCombo) this.highestCombo = this.combo;
        /*
         * aktualisiert Combo
         */
        $('#combo').text(`${this.combo} COMBO!`)
        /*
         * animiert Combo
         */
        if (this.combo == 5) $('#combo').addClass('over-five');
        AnimateUI.combo();
    }
}

Game.prototype._updateBoost = function(boostAmount) {
    let prevBoost = this.boostGauge;
    this.boostGauge += boostAmount;
    /*
    * Level-up ( boost 100% => nächste Stufe )
    */
   if (this.boostGauge >= 100) 
    {
        this.boostLevel++;
        this.boostGauge -= 100;
        $('#levelText').text(`STUFE ${this.boostLevel}`);
        AnimateUI.levelUp();
        prevBoost = 0;
        /*
         * erhöht und animiert aktuelle Geschwindigkeit
         */
        const bonusSpeed_base = 125;
        const bonusSpeed_combo = this.highestCombo * 50;
        const prevSpeed = this.rocketSpeed;
        this.rocketSpeed += bonusSpeed_base + bonusSpeed_combo;
        AnimateUI.speedUp({ prev: prevSpeed, curr: this.rocketSpeed });
        /*
         * aktualisiert die Geschwindigkeit des Hintergrunds
         */
        const canvasVelocity = { x: this.rocketSpeed / 2 };
        globals.canvas.setVelocity(canvasVelocity);
        /*
         * skaliert die Flamme nach der aktuellen Stufe
         */
        const threshold_x2 = 2;
        const threshold_x3 = 4;
        if (this.boostLevel > threshold_x3 && !$('.flame').hasClass('_scale8'))
        {
           $('.flame').removeClass('_scale6').addClass('_scale8');
        }
        else if (this.boostLevel > threshold_x2 && !$('.flame').hasClass('_scale6'))
        {
            $('.flame').addClass('_scale6');
        }
    }
    /*
     * animiert Boost
     */
    if (boostAmount > 0)
    {
        AnimateUI.gaugeUp({ prev: prevBoost, curr: this.boostGauge });
    }
}
//#endregion