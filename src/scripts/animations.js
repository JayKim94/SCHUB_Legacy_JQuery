// animations.js
// die Sammlung von vordefinierten Animationen
// Bibliothek: anime.js

// Jawoon Kim PBT3H19A
import anime from 'animejs/lib/anime.es.js';
import globals from './globals';

export const AnimateRocket = {
    flame: (rocketSpeed) => {
        const ratio = rocketSpeed / (rocketSpeed + 100);
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
        anime({
            targets: '#rocket_container',
            easing: 'easeOutExpo',
            top: innerHeight / 3,
            left: '50%',
            duration: 3500,
        });
    },
    float: (rocketSpeed) => {
        const ratio = rocketSpeed / (rocketSpeed + 100);
        const min = (innerHeight / 3) - (ratio * 60);
        const max = (innerHeight / 3) + (ratio * 135);
        anime({
            targets: '#rocket_container',
            easing: 'easeInOutExpo',
            keyframes: [
                { top: `${min}px` },
                { top: `${max}px` },
            ],
            loop: true,
            duration: 5000,
            direction: 'alternate',
        });
    },
}

export const AnimateQuiz = {
    clear: () => {
        anime({
            targets: '.cleared',
            opacity: 0.2,
            left: {
                value: '-=350px',
                duration: 250,
            },
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
            easing: 'easeOutExpo',
            duration: 1000,
            delay: function(el, i) {
                return i * 150;
            },
            opacity: .8,
            fontSize: [
                {value: '10rem', duration: 150},
                {value: '6rem'},
            ],
            left: {
                value: function(el, i) {
                    const letterSpacing = 75;
                    const xOffset = el.textContent.length < 2 ? 350 : 375;
                    return `-=${ xOffset - (letterSpacing * i) }px`
                },
            },
            complete: function(anim) {
                globals.game.isReady = true;
            }
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
    wrongAnswer: () => {
        anime({
            targets: '.wrong',
            complete: function(anim) {
                document.getElementById('answer').classList.remove('wrong');
            },
            keyframes: [
                {left: '-=8px'},
                {left: '+=8px'},
                {left: '-=5px'},
                {left: '+=5px'},
                {left: '-=8px'},
                {left: '+=8px'},
            ],
            loop: 3,
            duration: 200,
        });
    }
};