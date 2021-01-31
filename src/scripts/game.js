// game.js
// Game definiert die Spiellogik.
// Bibliothek: jquery.js

// Jawoon Kim PBT3H19A
import $ from 'jquery';

import { AnimateRocket, AnimateQuiz, AnimateUI } from './animations.js';
import globals from './globals.js';
import { random } from './utils.js';
import { Quiz } from './models/quiz.js';

//#region Constructor
export function Game() {
    this.isReady = false;
    this.isStarted = false;
    this.currentQuiz;
    this.init();
}
Game.prototype.init = function() {
    const rocket = $('#rocket_container');
    this.score = 0;
    this.rocketSpeed = 0;
    rocket.addClass('opening');
    this.openingAnimation = AnimateRocket.openingSequence();
}
//#endregion
//#region Methoden
Game.prototype.start = function() {
    const rocket = $('#rocket_container');
    const countdown = $('#countdown');
    const score = $('#score');
    const delay = 1000;
    this.openingAnimation.pause();
    rocket.removeClass('opening');
    // stop canvas rotation
    globals.canvas.resetRotation();
    globals.canvas.setBackgroundAlpha(0.35);
    // start the game
    this.isStarted = true;
    this.currentQuiz = new Quiz({ 
        op1: random(1, 9), 
        operator: '+', 
        op2: random(1, 9) 
    });
    rocket.addClass('in_game');
    // count-down
    AnimateRocket.start();
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
        globals.canvas.setVelocity({x: this.rocketSpeed});
        this._next();
    }, delay * 4);
}
Game.prototype.submit = function() {
    // Spiellogik
    const isCorrect = this._isAnswerCorrect();
    
    // Aktualisierung der Attributen
    this.addSpeed(isCorrect);
    this.addScore(isCorrect);
    
    if (!isCorrect) {
        $('#answer').addClass('wrong');
        AnimateUI.wrongAnswer();
    }
    else $('#answer').text('');
    
    // Animationen
    const backgroundVelocity = { x: this.rocketSpeed / 100, };
    globals.canvas.setVelocity(backgroundVelocity);
    
    AnimateRocket.float(this.rocketSpeed);
    AnimateRocket.flame(this.rocketSpeed);
    AnimateRocket.smoke(isCorrect ? 0 : .5);
    
    if (isCorrect) this._next();
}
Game.prototype.write = function(answer) {
    const field = $('#answer');
    if (this._isAnswerReady()) field.append(answer)
}
Game.prototype.addScore = function(isCorrect) {
    const increment = isCorrect ? 10 * this.rocketSpeed : -500;
    const prev = this.score;
    const curr = (this.score + increment < 0) ? 0 : this.score + increment;
    
    this.score = curr;
    
    AnimateUI.count({ targets: '#score', prev, curr });
}
Game.prototype.addSpeed = function(isCorrect) {
    const increment = isCorrect ? random(70, 100) : -50;
    const prev = this.rocketSpeed;
    const curr = (this.rocketSpeed + increment < 0) ? 0 : this.rocketSpeed + increment;
    
    this.rocketSpeed = curr;
    
    AnimateUI.count({ targets: '#speed', prev, curr });
}
//#endregion
//#region Private
Game.prototype._next = function() {
    const active = $('.active');
    // mark as cleared
    active
    .removeClass('active')
    .addClass('cleared');
    this.currentQuiz.next();
    this.currentQuiz.currentMap().forEach((val, key) => 
    {
        // append to overlay
        $('<div class="op active"></div>')
            .addClass(key)
            .attr('value', val)
            .text(val)
            .appendTo('#overlay_container');
    });

    AnimateQuiz.clear();
    AnimateQuiz.next();
}
Game.prototype._isAnswerReady = function() {
    return $('#answer').text().length < 2 && this.isReady;
}
Game.prototype._isAnswerCorrect = function() {
    return $('#answer').text() === this.currentQuiz.answer().toString();
}
//#endregion