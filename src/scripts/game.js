// game.js
// Game definiert die Spiellogik.
// Bibliothek: jquery.js

// Jawoon Kim PBT3H19A
import $ from 'jquery';

import globals from './globals.js';
import { random } from './utils.js';
import { Quiz } from './models/quiz.js';
import { 
    animate_clearedQuiz,
    animate_currentQuiz, 
    animate_startRocket, 
    animate_floatRocket,
    animate_numbers,
 } from './animations.js';

//#region Constructor
export function Game() {
    this.isReady = false;
    this.isStarted = false;
    this.currentQuiz;
    this.init();
}
Game.prototype.init = function() {
    this.score = 0;
    this.playPosY = innerHeight / 3;
    this.rocketSpeed = 0;
}
//#endregion
//#region Methoden
Game.prototype.start = function() {
    const rocket = $('#rocket_container');
    const delay = 500;
    // stop canvas rotation
    globals.canvas.setRotationValue(0);
    // start the game
    this.isStarted = true;
    this.rocketSpeed += 5;
    this.currentQuiz = new Quiz({ 
        op1: random(1, 9), 
        operator: '+', 
        op2: random(1, 9) 
    });
    rocket.addClass('in_game');
    animate_startRocket({ positionY: this.playPosY });
    // count-down
    const countdown = $('#countdown');
    const score = $('#score');
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
        animate_floatRocket();
        this._update();
    }, delay * 4);
}
Game.prototype.submit = function() {
    const answer = $('#answer');
    const active = $('.active');
    if (this._isAnswerCorrect()) 
    {
        globals.canvas.setVelocity({ x: this.rocketSpeed });
        this.rocketSpeed += 1;
        this.addScore(200);
        // clears input
        answer.text('');
        // moves cleared quiz
        active
            .removeClass('active')
            .addClass('cleared');
        animate_clearedQuiz();
        this.currentQuiz.next();
        this._update();
    } 
    else 
    {
        answer.text('');
    }
}
Game.prototype.write = function(answer) {
    if (this._isAnswerReady()) 
    {
        const field = $('#answer');
        field.append(answer)
    };
}
Game.prototype.addScore = function(score) {
    const prev = this.score;
    const current = this.score + score;
    this.score += score;
    animate_numbers({ targets: '#score', prev, current });
}
//#endregion
//#region Private
Game.prototype._update = function() {
    // gets Quiz data
    const { op1, operator, op2 } = this.currentQuiz;
    // loops materials
    const classes = ['op1', 'operator', 'op2', 'eq'];
    const targets = [op1.toString(), operator, op2.toString(), '='];
    // adds to document
    classes.map((name, index) => 
        $(`<div class="op active ${name}"></div>`)
            .attr('value', targets[index])
            .text(targets[index])
            .appendTo('#overlay_container'));
    animate_currentQuiz();
}
Game.prototype._isAnswerReady = function() {
    return $('#answer').text().length < 2 && this.isReady;
}
Game.prototype._isAnswerCorrect = function() {
    return $('#answer').text() === this.currentQuiz.answer().toString();
}
//#endregion