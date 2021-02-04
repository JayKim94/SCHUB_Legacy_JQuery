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
    this.boostGauge = 0;
    this.boostLevel = 1;
    this.openingAnimation = AnimateRocket.openingSequence();
    this.floatingAnimations = [];
}
//#endregion
//#region Methoden
Game.prototype.startGame = function() {
    this.openingAnimation.pause();
    this.timeLeft = 60;
    $('#timer_num').text(`${this.timeLeft}`);
    // Reset Rotation
    globals.canvas.resetRotation();
    globals.canvas.setBackgroundAlpha(0.55);
    
    // Rocket
    AnimateRocket.start();
    
    // Count-Down
    this._countdownSequence();
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
    // Spiellogik
    const isCorrect = (playerAnswer === this.currentQuiz.answer().toString());
    const basePoint = 100;
    const bonusPoint = this.boostLevel * Math.floor(this.rocketSpeed / 100) * 50 + 50;
    const boostAmount = isCorrect ? (this.combo * 5 + 10) : 0;
    const score = isCorrect ? bonusPoint + basePoint : 0;
    const speed = isCorrect ? 100 : -20;

    // Animationen
    /* Eingabefeld */
    if (isCorrect) $('.active').removeClass('active').addClass('cleared');
    else $('#answer').addClass('wrong');
    /* Rocket */
    if (this.floatingAnimations.length == 0)
    {
        this.floatingAnimations.push(AnimateRocket.float_vertical());
        this.floatingAnimations.push(AnimateRocket.float_horizontal());
    }
    AnimateRocket.flame();
    AnimateRocket.smoke(isCorrect ? 0 : .5);
    if (!isCorrect) { AnimateUI.wrongAnswer(); AnimateQuiz.drop(); }
    else { AnimateUI.correctAnswer(); $('answer').text(''); }

    globals.canvas.setVelocity({ x: this.rocketSpeed + speed });

    // Aktualisierung
    this.updateCombo(isCorrect);
    this.updateScore(score);
    this.updateBoost(speed, boostAmount);
    
    return isCorrect;
}

Game.prototype.animateToNextQuiz = function() {
    AnimateQuiz.clear();
    AnimateQuiz.next();
}

Game.prototype.updateScore = function(score) {
    const prev = this.score;
    const curr = (this.score + score < 0) ? 0 : this.score + score;

    this.score = curr;
    
    if (this.boostLevel > 1) $('#multiplier').text(`X ${this.boostLevel} BONUS!`);

    AnimateUI.addedScore(score);
    setTimeout(() => {
        AnimateUI.count({ 
            targets: '#score', 
            prev,
            curr,
        });
    }, 1000);
}

Game.prototype.updateCombo = function(isCorrect) {
    if (isCorrect) this.combo++;
    else this.combo = 0;

    if (this.combo > 2) 
    {
        $('#combo').text(`${this.combo} COMBO!`)
        if (this.combo == 5) $('#combo').addClass('over-five');
        AnimateUI.combo();
    }
}

Game.prototype.updateBoost = function(speed, boostAmount) {
    const prev = this.boostGauge;
    const curr = this.boostGauge + boostAmount;
    
    this.rocketSpeed += speed;
    this.boostGauge += boostAmount;

    if (this.boostGauge >= 100) 
    {
        this.boostLevel++;
        this.boostGauge -= 100;
    }
    
    const _opacity = (this.boostGauge / 1000) + 0.05;
    $('.status').animate({opacity: _opacity});

    AnimateUI.count({ 
        targets: '#boost',
        prev,
        curr,
    });
}

Game.prototype.getNextQuizMap = function() {
    if (this.currentQuiz != null) this.currentQuiz.next();
    else 
    {
        this.currentQuiz = new Quiz();
    }

    return this.currentQuiz.currentMap();
}
//#endregion
//#region Private
Game.prototype._countdownSequence = function() {
    const countdown = $('#countdown');
    const delay = 1000;

    setTimeout(() => {
        countdown.text('3').fadeIn();
    }, delay);
    setTimeout(() => {
        countdown.text('2');
    }, delay * 2);
    setTimeout(() => {
        countdown.text('1');
    }, delay * 3);
    setTimeout(() => {
        countdown.remove();
        $('#answer_field').fadeIn(1500);

        
        this._startTimer();
        
        AnimateQuiz.next();
        globals.ready = true;
    }, delay * 4);
}

Game.prototype._startTimer = function() {
    const tick = 1000;
    setInterval(() => {
        if (this.isPaused) return;

        this.timeLeft--;
        $('#timer_num').text(`${this.timeLeft}`);
    }, tick);
}
//#endregion