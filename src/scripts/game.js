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
    this.isReady = false;
    this.currentQuiz;
    this.init();
}

Game.prototype.init = function() {
    this.score = 0;
    this.rocketSpeed = 0;
    this.currentQuiz = new Quiz();
    this.openingAnimation = AnimateRocket.openingSequence();


}
//#endregion
//#region Methoden
Game.prototype.start = function() {
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

Game.prototype.submit = function() {
    // Spiellogik
    const isCorrect = this._isAnswerCorrect();
    const multiplier = Math.floor(this.rocketSpeed / 100);
    const basePoint = 100;
    const bonusPoint = 50;
    const score = isCorrect ? multiplier * bonusPoint + basePoint : 0;
    const speed = isCorrect ? 100 : -20;

    // Animation
    if (isCorrect) $('.active').removeClass('active').addClass('cleared');
    else $('#answer').addClass('wrong');

    AnimateUI.count({ 
        targets: '#speed',
        prev: this.rocketSpeed,
        curr: this.rocketSpeed + speed });
    AnimateUI.count({ 
        targets: '#score', 
        prev: this.score,
        curr: this.score + score });
    AnimateRocket.flame();
    AnimateRocket.smoke(isCorrect ? 0 : .5);
    if (!isCorrect) { AnimateUI.wrongAnswer(); AnimateQuiz.drop(); };

    globals.canvas.setVelocity({ x: this.rocketSpeed + speed });

    // Aktualisierung
    this.addScore(score);
    this.addSpeed(speed);
    if (isCorrect) this.currentQuiz.next();

    return isCorrect;
}

Game.prototype.next = function() {
    AnimateQuiz.clear();
    AnimateQuiz.next();
}

Game.prototype.write = function(answer) {
    const field = $('#answer');
    if (this._isAnswerReady()) field.append(answer)
}

Game.prototype.addScore = function(score) {
    const prev = this.score;
    const curr = (this.score + score < 0) ? 0 : this.score + score;
    
    this.score = curr;
}

Game.prototype.addSpeed = function(speed) {
    const prev = this.rocketSpeed;
    const curr = (this.rocketSpeed + speed < 0) ? 0 : this.rocketSpeed + speed;
    
    this.rocketSpeed = curr;
}

Game.prototype.getQuizMap = function() {
    return this.currentQuiz?.currentMap();
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
        AnimateQuiz.next();
        $('#answer_field').fadeIn(1500);
        AnimateRocket.float();
        setInterval(() => {
            this.timeLeft--;
            $('#timer_num').text(`${this.timeLeft}`);
        }, 1000);
    }, delay * 4);
}

Game.prototype._isAnswerReady = function() {
    return $('#answer').text().length < 2;
}

Game.prototype._isAnswerCorrect = function() {
    return $('#answer').text() === this.currentQuiz.answer().toString();
}
//#endregion