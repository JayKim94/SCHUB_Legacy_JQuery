import './main.scss';
import $ from 'jquery';
import { UI } from './scripts/ui.js';
import globals from './scripts/globals.js';
import { BackgroundCanvas } from './scripts/backgroundCanvas.js';
import { Game } from './scripts/game';

$(function() {
    globals.canvas = new BackgroundCanvas();
    const ui = new UI();
    globals.game = new Game();
    animateBackgroundCanvas();
});

function animateBackgroundCanvas() {
    requestAnimationFrame(animateBackgroundCanvas);
    globals.canvas.update();
}