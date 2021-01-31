// game.js
// Game definiert die Spiellogik.
// Bibliothek: jquery.js

// Jawoon Kim PBT3H19A
import $ from 'jquery';

import Animate from './animations.js';
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
    this.playPosY = innerHeight / 3;
    this.rocketSpeed = 0;
    rocket.addClass('opening');
    this.openingAnimation = Animate.openingRocket();
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
    globals.canvas.setBackgroundAlpha(.55);
    // start the game
    this.isStarted = true;
    this.rocketSpeed += 5;
    this.currentQuiz = new Quiz({ 
        op1: random(1, 9), 
        operator: '+', 
        op2: random(1, 9) 
    });
    rocket.addClass('in_game');
    // count-down
    Animate.startRocket({ positionY: this.playPosY });
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
        score.animate({opacity: 1});
        globals.canvas.setVelocity({x: this.rocketSpeed});
        globals.canvas.setBackgroundAlpha(.95);
        Animate.floatRocket();
        this._next();
    }, delay * 4);
}
Game.prototype.submit = function() {
    const field = $('#answer');
    if (this._isAnswerCorrect()) 
    {
        field.text('');
        globals.canvas.setVelocity({ x: this.rocketSpeed });
        Animate.hideSmoke();
        Animate.showFlame({ opacity: 0.5, scale: 0.5 });
        this.rocketSpeed += 1;
        this.addScore(200);
        this._next();
    } 
    else 
    {
        field.text('');
    }
}
Game.prototype.write = function(answer) {
    const field = $('#answer');
    if (this._isAnswerReady()) 
    {
        field.append(answer)
    };
}
Game.prototype.addScore = function(score) {
    const prev = this.score;
    const curr = this.score + score;
    this.score += score;
    Animate.countNumber({ targets: '#score', prev, curr });
}
//#endregion
//#region Private
Game.prototype._next = function() {
    const active = $('.active');
    // mark as cleared
    active
        .removeClass('active')
        .addClass('cleared');
    Animate.clear();
    // next quiz
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
    Animate.showActive();
}
Game.prototype._isAnswerReady = function() {
    return $('#answer').text().length < 2 && this.isReady;
}
Game.prototype._isAnswerCorrect = function() {
    return $('#answer').text() === this.currentQuiz.answer().toString();
}
//#endregion