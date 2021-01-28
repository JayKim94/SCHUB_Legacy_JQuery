import './main.scss';
import $ from 'jquery';
import { UI } from './scripts/ui.js';
import globals from './scripts/globals.js';
import { BackgroundCanvas } from './scripts/backgroundCanvas.js';
import { Game } from './scripts/game';

$(function() {
    const ui = new UI();
    const game = new Game();
    const canvas = new BackgroundCanvas();
    globals.canvas = canvas;
    globals.game = game;
    animateBackgroundCanvas();
});

function animateBackgroundCanvas() {
    requestAnimationFrame(animateBackgroundCanvas);
    globals.canvas.update();
}