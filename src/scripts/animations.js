// animations.js
// die Sammlung von vordefinierten Animationen
// Bibliothek: anime.js

// Jawoon Kim PBT3H19A
import anime from 'animejs/lib/anime.es.js';
import globals from './globals';

export const animate_clearedQuiz = () => {
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
}
export const animate_currentQuiz = () => {
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
}
export const animate_startRocket = ({positionY}) => {
    anime({
        targets: '.flame_wrapper',
        easing: 'easeOutExpo',
        opacity: 0.75,
        duration: 500,
    });
    anime({
        targets: '#rocket_container',
        easing: 'easeOutExpo',
        top: positionY,
        duration: 1500,
    });
    
}
export const animate_floatRocket = () => {
    anime({
        targets: '#rocket_container',
        easing: 'easeInOutQuad',
        keyframes: [
            {top: '-=65px'},
            {top: '+=135px'},
        ],
        loop: true,
        duration: 2500,
        direction: 'alternate',
    });
}
export const animate_numbers = ({targets, prev, current}) => {
    anime({
        targets: targets,
        innerHTML: [prev, current],
        easing: 'easeInOutExpo',
        round: 1,
    });
}