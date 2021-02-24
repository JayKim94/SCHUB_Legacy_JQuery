// game.js
// Game definiert die Spiellogik / verwaltet Animationen.
// Bibliothek: jquery.js

// Jawoon Kim PBT3H19A
import $ from 'jquery';
import globals from './globals.js';

import { AnimateRocket, AnimateQuiz, AnimateUI } from './animations.js';
import { Quiz } from './models/quiz.js';

import CorrectSound from '../resources/correct.wav';
import WrongSound from '../resources/wrong.mp3';
import LevelUpSound from '../resources/level_up.mp3';
import BackgroundMusic from '../resources/background_music.mp3';

//#region Constructor

export function Game() {
    this.currentQuiz;
    this.backgroundMusic;
    this.init();
}

Game.prototype.init = function() {
    this.isReady = false;
    this.isPaused = false;
    this.score = 0;
    this.rocketSpeed = 0;
    this.maxSpeed = 0;
    this.quizCount = 0;
    this.submitCount = 0;
    this.combo = 0;
    this.highestCombo = 0;
    this.boostGauge = 0;
    this.boostLevel = 1;
    this.openingAnimation = AnimateRocket.openingSequence();
    this.floatingAnimations = [];
    this._updateProgress(this.boostGauge);

    if (this.backgroundMusic == null) 
    {
        this.backgroundMusic = $('#bg_music');
        $('#bg_source').attr('src', BackgroundMusic);
        this.backgroundMusic[0].volume = 0.5;
        this.backgroundMusic[0].pause();
        this.backgroundMusic[0].load();
    }
    
    this.correctSound = new Audio(CorrectSound);
    this.correctSound.volume = 0.25;
    this.wrongSound = new Audio(WrongSound);
    this.levelUpSound = new Audio(LevelUpSound);
}

//#endregion

//#region Methoden

Game.prototype.ready = function() {
    this.backgroundMusic[0].currentTime = 0;
    this.backgroundMusic[0].play();
    /*
     * setzt Rotation zurück
     */
    globals.canvas.resetRotation();
    globals.canvas.setBackgroundAlpha(0.95);
    globals.canvas.setVelocity({x: 0});
    /*
     * zur Startposition
     */
   this.openingAnimation.pause();
   AnimateRocket.start();
}

Game.prototype.start = function() {
    globals.canvas.setVelocity({ x: this.rocketSpeed / 1000 });
    globals.ready = true;
    AnimateQuiz.next();
}

Game.prototype.submit = function(playerAnswer) {
    this.submitCount++;
    const isCorrect = (playerAnswer === this.currentQuiz.answer().toString());
    /*
     * berechnet die erhaltene Punktzahl
     */
    let deltaBoost, deltaScore, deltaSpeed;
    if (isCorrect)
    {
        this.quizCount++;

        deltaBoost = (this.combo <= 10) ? 10 + this.combo * 2 : 30;
        deltaScore = 100 + (this.combo * 100) + this.boostLevel * 200;
        deltaSpeed = 250 + this.combo * 50;

        this.correctSound.pause();
        this.correctSound.currentTime = 0;
        this.correctSound.play();
    }
    else
    {
        deltaBoost = 0;
        deltaScore = 0;
        if (this.rocketSpeed > 25) deltaSpeed = -25;
        else deltaSpeed = 0;

        this.wrongSound.pause();
        this.wrongSound.currentTime = 0;
        this.wrongSound.play();
    }
    /*
     * aktualisiert und animiert entsprechend
     */
    this._updateCombo(isCorrect);
    this._updateScore(deltaScore);
    this._updateBoost(deltaBoost);
    this._updateRocketSpeed(deltaSpeed);
    /*
     * animiert UI und Rocket
     */
    if (isCorrect) 
    {
        AnimateUI.correct(); 
        AnimateRocket.flame(this.rocketSpeed);
        AnimateRocket.smoke(0);
        /*
         * färbt das Antwortfeld
         */
        if (!$('#circle').hasClass('_active')) $('#circle').addClass('_active');
        /*
         * markiert das Quiz für anschließenden Animationen
         */
        $('.active').removeClass('active').addClass('cleared');
    }
    else 
    {
        if ($('#circle').hasClass('_active')) $('#circle').removeClass('_active');
        AnimateUI.wrong();
        AnimateRocket.smoke(.75);
    }
    if (this.rocketSpeed > 0 && this.floatingAnimations.length == 0)
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
    this._backgroundMusic('pause');
}

Game.prototype.continue = function() {
    /*
     * setzt das Spiel fort
     */
    this.isPaused = false;
    this.floatingAnimations.forEach(anim => anim.play());
    globals.canvas.setVelocity({ x: this.rocketSpeed / 1000 });
    this._backgroundMusic('play');
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

Game.prototype.animateOutro = function() {
    /*
     * Outro
     */
    globals.canvas.setBackgroundAlpha(0.75); 
    this.floatingAnimations.forEach(anim => anim.pause());
    AnimateRocket.smoke(0);
    AnimateRocket.outroSequence();
    /*
     * wartet auf die 'last-second' Eingabe,
     * um Überschneidung zu vermeiden.
     */ 
    setTimeout(() => AnimateQuiz.dropEverything(), 1000);
}

Game.prototype.getResult = function() {
    return {
        score: this.score,
        maxSpeed: this.maxSpeed,
        quizCount: this.quizCount,
        accuracy: Math.floor((this.quizCount / this.submitCount) * 100)
    }
}

//#endregion

//#region Helper-Funktionen



Game.prototype._backgroundMusic = function(action) {
    if (action === 'play') 
    {
        this.backgroundMusic[0].play();
        this.backgroundMusic.animate({volume: 1}, 1000);
    }
    else if (action === 'pause')
    {
        this.backgroundMusic.animate({volume: 0}, 1000, 'swing', () => {
            this.backgroundMusic[0].pause();
        });
    }
}

Game.prototype._updateScore = function(score) {
    const prev = this.score;
    this.score += score;
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
     * Effekte nur ab 2.
     */
    if (this.combo > 1)
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

Game.prototype._updateRocketSpeed = function(deltaSpeed) {
    /*  
     * erhöht und animiert aktuelle Geschwindigkeit
     */
    const prevSpeed = this.rocketSpeed;
    this.rocketSpeed += deltaSpeed;
    if (this.rocketSpeed > this.maxSpeed) this.maxSpeed = this.rocketSpeed;
    AnimateUI.speedUp({ prev: prevSpeed, curr: this.rocketSpeed });
    /*
     * aktualisiert die Geschwindigkeit des Hintergrunds
     */
    if (this.rocketSpeed > 5000) globals.canvas.setBackgroundAlpha(0.75);
    if (this.rocketSpeed > 10000) globals.canvas.setBackgroundAlpha(0.55);
    globals.canvas.setVelocity({ x: this.rocketSpeed / 1000 });
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
        
        setTimeout(() => this.levelUpSound.play(), 500);
    }
    /*
     * animiert Boost
     */
    if (boostAmount > 0)
    {
        this._updateProgress(this.boostGauge);
        AnimateUI.gaugeUp({ prev: prevBoost, curr: this.boostGauge });
    }
}

Game.prototype._updateProgress = function(percent) {
    const circle = document.querySelector('.progress-ring circle');
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - percent / 100 * circumference;
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = offset;
}
//#endregion