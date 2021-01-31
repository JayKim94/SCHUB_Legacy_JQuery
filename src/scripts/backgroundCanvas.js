// backgroundCanvas.js
// BackgroundCanvas zeichnet den Hintergrund.
// keine externe Bibliothek.

// Jawoon Kim PBT3H19A
import { Star } from './models/star.js';
import { random } from './utils.js';

//#region Constructor
export function BackgroundCanvas() {
    this.backgroundRotateRadians = 0;
    this.backgroundAlpha = 0.98;
    this.starsCount = 500;
    this.rotateValue = 0.0005;
    this.stars = [];
    this.init();
}
//#endregion
//#region Methoden
BackgroundCanvas.prototype.init = function() {
    this.canvas = document.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = innerWidth;
    this.canvas.height = innerHeight;
    this.drawWidth = (this.canvas.width + 1600) / 2;
    this.drawHeight = (this.canvas.height + 1000) / 2;
    this.draw();
}
BackgroundCanvas.prototype.setVelocity = function({x}) {
    this.stars.forEach(star => { star.velocity.x = x; });
}
BackgroundCanvas.prototype.setRotationValue = function(value) {
    this.rotateValue = value;
}
BackgroundCanvas.prototype.update = function() {
    // clears canvas
    this.ctx.fillStyle = `rgba(30, 30, 30, ${this.backgroundAlpha})`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    // rotates canvas
    this.ctx.save();
    // sets the pivot point
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    // takes radians (360° = 2 * Math.PI)
    this.ctx.rotate(this.backgroundRotateRadians);
    if (this.backgroundRotateRadians >= 2 * Math.PI) this.backgroundRotateRadians = 0;
    if (this.backgroundRotateRadians >= 0) this.backgroundRotateRadians += this.rotateValue;
    // draw stars
    this.stars.forEach((star) => {
        if (star.x < -this.drawWidth) {
            star.reset(this._getRandomStar(this.drawWidth));
        } else {
            star.update();
        }
    });
    this.ctx.restore();
}
BackgroundCanvas.prototype.draw = function() {
    this.stars = [];
    for (let i = 0; i < this.starsCount; i++) {
        const star = new Star(this._getRandomStar());
        this.stars.push(star);
    };
}
BackgroundCanvas.prototype.resetRotation = function() {
    this.rotateValue = -(this.rotateValue + 0.005);
}
BackgroundCanvas.prototype.setBackgroundAlpha = function(alpha) {
    this.backgroundAlpha = alpha;
}
BackgroundCanvas.prototype._getRandomStar = function(x = random(-this.drawWidth, this.drawWidth)){
    return {
        x,
        y: random(-this.drawHeight, this.drawHeight),
        radius: random(1, 3),
        color: `rgba(${random(80, 275)}, 171, 255, ${random(.25, .5)})`,
        ctx: this.ctx,
    };
}
//#endregion