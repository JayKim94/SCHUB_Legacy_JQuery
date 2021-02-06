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
    this.isEnded = false;
    this.score = 0;
    this.rocketSpeed = 0;
    this.combo = 0;
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
    const countdown = $('#countdown');
    const delay = 1000;
    setTimeout(() => { countdown.text('3').fadeIn(); }, delay);
    setTimeout(() => { countdown.text('2'); }, delay * 2);
    setTimeout(() => { countdown.text('1'); }, delay * 3);
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
        globals.ready = true;
    }, delay * 4);
}

Game.prototype.pause = function() {
    this.isPaused = true;
    this.floatingAnimations.forEach(anim => anim.pause());
    globals.canvas.setVelocity({ x: 0 })
}

Game.prototype.continue = function() {
    this.isPaused = false;
    this.floatingAnimations.forEach(anim => anim.play());
    globals.canvas.setVelocity({ x: this.rocketSpeed });
}

Game.prototype.submit = function(playerAnswer) {
    /*
     * stellt Spieldaten bereit
     */
    const basePoint = 100;
    const bonusPoint = this.boostLevel * Math.floor(this.rocketSpeed / 100) * 50 + 50;
    const prevScore = this.score;
    
    const isCorrect = (playerAnswer === this.currentQuiz.answer().toString());
    
    const deltaBoost = isCorrect ? (this.combo * 5 + 10) : 0;
    const deltaScore = isCorrect ? bonusPoint + basePoint : 0;
    const deltaSpeed = isCorrect ? 100 : -20;
    /*
     * aktualisiert
     */
    this._updateCombo(isCorrect);
    this._updateScore(deltaScore);
    this._updateBoost(deltaSpeed, deltaBoost);
    /*
     * animiert
     */
    if (isCorrect) 
    {
        $('.active').removeClass('active').addClass('cleared');
        AnimateUI.correct(); 
        AnimateRocket.flame();
        AnimateRocket.smoke(0);
        this.showBoost();
    }
    else 
    {
        AnimateUI.wrong();
        AnimateQuiz.drop(); 
        AnimateRocket.smoke(.5);
        this.hideBoost();
    }
    
    AnimateUI.score({prev: prevScore, curr: prevScore + deltaScore});
    if (deltaScore > 0) AnimateUI.increment(deltaScore);
    if (this.floatingAnimations.length == 0)
    {
        this.floatingAnimations.push(AnimateRocket.float_vertical());
        this.floatingAnimations.push(AnimateRocket.float_horizontal());
    }
    /*
     * aktualisiert die Geschwindigkeit des Hintergrunds
     */
    globals.canvas.setVelocity({ x: this.rocketSpeed });
    /*
     * weiter mit UI-Interaktion
     */
    return isCorrect;
}

Game.prototype.animateToNextQuiz = function() {
    globals.ready = false;
    
    setTimeout(() => {
        AnimateQuiz.clear();
        AnimateQuiz.next();
        globals.ready = true;
    }, 300);
}

Game.prototype.getNextQuizMap = function() {
    if (this.currentQuiz != null) this.currentQuiz.next();
    else this.currentQuiz = new Quiz();

    return this.currentQuiz.currentMap();
}

Game.prototype.showBoost = function () {
    const baseOpacity = 0.05;
    const addedOpacity = baseOpacity + (this.boostGauge / 500);

    $('#boostGauge').fadeTo(300, addedOpacity);
}

Game.prototype.hideBoost = function () {
    $('#boostGauge').fadeTo(150, 0.0);
}
//#endregion
//#region Private
Game.prototype._startTimer = function() {
    const tick = 1000;
    setInterval(() => {
        if (this.isPaused) return;

        this.timeLeft--;
        
        if (this.timeLeft < 0) 
        {
            $('.in_game_ui').fadeOut(3000);
            this.isEnded = true;
        }
        else 
        {
            $('#timer_num').text(`${this.timeLeft}`);
        }
    }, tick);
}

Game.prototype._updateScore = function(score) {
    const prev = this.score;
    const curr = (this.score + score < 0) ? 0 : this.score + score;

    this.score = curr;
    
    if (this.boostLevel > 1) $('#levelText').text(`STUFE ${this.boostLevel}`);
}

Game.prototype._updateCombo = function(isCorrect) {
    if (isCorrect) this.combo++;
    else this.combo = 0;

    if (this.combo > 2) 
    {
        $('#combo').text(`${this.combo} COMBO!`)
        if (this.combo == 5) $('#combo').addClass('over-five');
        AnimateUI.combo();
    }
}

Game.prototype._updateBoost = function(speed, boostAmount) {
    let prevBoost = this.boostGauge;
    const prevSpeed = this.rocketSpeed;

    this.rocketSpeed += speed;
    this.boostGauge += boostAmount;

    
    if (this.boostGauge >= 100) 
    {
        this.boostLevel++;
        this.boostGauge -= 100;
        $('#levelText').text(`STUFE ${this.boostLevel}`);
        AnimateUI.levelUp();
        prevBoost = 0;
    }
    
    AnimateUI.count({ 
        targets: '#boost',
        prev: prevBoost,
        curr: this.boostGauge,
        round: 1,
    });
    
    AnimateUI.speedUp({ 
        prev: prevSpeed,
        curr: this.rocketSpeed,
    });
    
}
//#endregion