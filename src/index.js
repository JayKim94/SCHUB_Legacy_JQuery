import './main.scss';
import $ from 'jquery';
import UI from './scripts/ui.js';
import BackgroundCanvas from './scripts/backgroundCanvas.js';
import globals from './scripts/globals.js';

$(function() {
    /*
     * zeichnet und animiert den Hintergrund
     */
    globals.canvas = new BackgroundCanvas();
    animateBackgroundCanvas();
    /*
     * initialisiert die Benutzeroberfläche
     */
    new UI().init();
    /*
     * zeichnet neu, wenn skaliert
     */
    $(window).on('resize', () => globals.canvas.init());
});

function animateBackgroundCanvas() {
    requestAnimationFrame(animateBackgroundCanvas);
    globals.canvas.update();
}