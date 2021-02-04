// animations.js
// die Sammlung von vordefinierten Animationen
// Bibliothek: anime.js

// Jawoon Kim PBT3H19A
import anime from 'animejs/lib/anime.es.js';
import globals from './globals';
import { random } from './utils';

export const AnimateRocket = {
    flame: () => {
        const speed = globals.game.rocketSpeed;
        const ratio = speed / (speed + 100);
        anime({
            targets: '.flame_wrapper',
            easing: 'easeOutExpo',
            opacity: ratio,
            duration: 500,
        });
    },
    smoke: (opacity) => {
        anime({
            targets: '.smoke_wrapper',
            easing: 'easeOutExpo',
            opacity: opacity,
            duration: 3000,
        });
    },
    openingSequence: () => {
        return anime({
            targets: '.opening',
            easing: 'linear',
            left: '50%',
            duration: 10000,
        });
    },
    start: () => {
        const startingTop = innerHeight / 3;
        anime({
            targets: '#rocket_container',
            easing: 'easeOutExpo',
            top: startingTop,
            left: '50%',
            duration: 3500,
        });
    },
    float_vertical: () => {
        const speed = globals.game.rocketSpeed;
        const ratio = speed / (speed + 100);
        const startingTop = innerHeight / 3;
        return anime({
            targets: '#rocket_container',
            easing: 'linear',
            top: [
                {value: `${startingTop - 20}px`, duration: 2500},
                {value: `${startingTop + 100}px`, duration: 3700},
            ],
            loop: true,
            direction: 'alternate',
        });
    },
    float_horizontal: () => {
        return anime({
            targets: '#rocket_container',
            left: [
                {value: `45%`, duration: 2200, easing: 'linear'},
                {value: `60%`, duration: 8300, easing: 'linear'},
            ],
            loop: true,
            direction: 'alternate',
        });
    }
}

export const AnimateQuiz = {
    clear: () => {
        anime({
            targets: '.cleared',
            left: { value: '-=350px', duration: 150, easing: 'easeInCirc' },
            opacity: { value: 0.1, duration: 500, easing: 'linear' },
            complete: function(anim) {
                document.querySelectorAll('.cleared').forEach((element) => {
                    if (parseInt(element.style.left) < 0) {
                        element.remove();
                    }
                });
            },
        });
    },
    next: () => {
        anime({
            targets: '.op.active',
            easing: 'easeInExpo',
            duration: 300,
            delay: function(el, i) {
                return i * 150;
            },
            opacity: {value: 0.75, duration: 200},
            fontSize: [
                {value: '2rem', duration: 150},
                {value: '6rem'},
            ],
            left: {
                value: function(el, i) {
                    const letterSpacing = 75;
                    const xOffset = el.textContent.length < 2 ? 425 : 450;
                    return `-=${ xOffset - (letterSpacing * i) }px`
                },
            },
        });
    },
    drop: () => {
        anime({
            targets: '.cleared',
            rotate: { value: random(30, 150), duration: 250, easing: 'linear' },
            keyframes: [
                { top: '-=30px', duration: 100, easing: 'linear' },
                { top: (innerHeight + 300), duration: 400, easing: 'easeInCirc' }
            ],
            complete: function(anim) {
                const cleared = document.getElementsByClassName('cleared');
                while (cleared.length > 0) cleared.item(0).remove();
            },
        });
    },
}

export const AnimateUI = {
    count: ({targets, prev, curr}) => {
        const isNegative = (curr - prev < 0);

        anime({
            targets: targets,
            color: isNegative ? ['#FF5555', '#FF5555', '#EFEFEF'] : '#EFEFEF',
            innerHTML: [prev, curr],
            easing: 'easeOutCirc',
            round: 1,
        });
    },
    addedScore: (score) => {
        anime({
            targets: '#added_score',
            innerHTML: [0, score],
            duration: 500,
            easing: 'linear',
            round: 1,
        });
        anime({
            targets: '#added_score',
            delay: 1000,
            innerHTML: [score, 0],
            duration: 500,
            easing: 'linear',
            round: 1,
        });
    },
    combo: () => {
        anime({
            targets: '#combo',
            top: ['-150px', '-180px'],
            opacity: [.8, 0],
            duration: 500,
            easing: 'linear',
        });
    },
    correctAnswer: () => {
        anime({
            targets: '#answer',
            color: '#33CCFF',
            fontSize: ['10rem', '8rem'],
            textShadow: [
                "0px 0px 1px #33CCFF",
                "0px 0px 15px #33CCFF",
            ],
            duration: 300,
            complete: function() {
                document.getElementById('answer').innerText = '';
                const style = document.getElementById('answer').style;
                style.color = '';
                style.textShadow = '';
            }
        });
    },
    wrongAnswer: () => {
        anime({
            targets: '.wrong',
            complete: function(anim) {
                document.getElementById('answer').classList.remove('wrong');
            },
            keyframes: [
                {left: '-=10px'},
                {left: '+=10px'},
                {left: '-=7px'},
                {left: '+=7px'},
                {left: '-=12px'},
                {left: '+=12px'},
            ],
            loop: 3,
            duration: 200,
        });
    },
};