// animations.js
// die Sammlung von vordefinierten Animationen
// Bibliothek: anime.js

// Jawoon Kim PBT3H19A
import anime from 'animejs/lib/anime.es.js';
import globals from './globals';

export default {
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
    showActive: () => {
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
    showFlame: ({opacity, scale}) => {
        anime({
            targets: '.flame_wrapper',
            easing: 'easeOutExpo',
            opacity: opacity,
            scale: scale,
            duration: 500,
        });
    },
    hideSmoke: () => {
        anime({
            targets: '.smoke_wrapper',
            easing: 'easeOutExpo',
            opacity: 0,
            duration: 300,
        });
    },
    openingRocket: () => {
        return anime({
            targets: '.opening',
            easing: 'linear',
            left: '50%',
            duration: 10000,
        });
    },
    startRocket: ({positionY}) => {
        anime({
            targets: '#rocket_container',
            easing: 'easeOutExpo',
            top: positionY,
            left: '50%',
            duration: 3500,
        });
    },
    floatRocket: () => {
        anime({
            targets: '#rocket_container',
            easing: 'easeInOutQuad',
            keyframes: [
                { top: '-=65px' },
                { top: '+=135px' },
            ],
            loop: true,
            duration: 2500,
            direction: 'alternate',
        });
    },
    countNumber: ({targets, prev, curr}) => {
        anime({
            targets: targets,
            innerHTML: [prev, curr],
            easing: 'easeInOutExpo',
            round: 1,
        });
    },
};