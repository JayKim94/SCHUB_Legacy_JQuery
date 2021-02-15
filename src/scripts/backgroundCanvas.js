// backgroundCanvas.js
// BackgroundCanvas zeichnet den Hintergrund.
// keine externe Bibliothek.

// Jawoon Kim PBT3H19A
import { Star } from './models/star.js';
import { random } from './utils.js';

//#region Constructor
export function BackgroundCanvas() {
    this.backgroundRotateRadians = 0.001;
    this.backgroundAlpha = 0.98;
    this.starsCount = 300;
    this.rotateValue = 0.0005;
    this.currentVelocity = 0;
    this.stars = [];
    this.isRotating = false;
    this.isResetting = false;
    this.init();
}
//#endregion
//#region Methoden
BackgroundCanvas.prototype.init = function() {
    const spielDiv = document.getElementById('spiel_body');
    this.canvas = document.createElement('canvas');
    spielDiv.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = spielDiv.offsetWidth;
    this.canvas.height = spielDiv.offsetHeight;
    this.drawWidth = (this.canvas.width + 1600) / 2;
    this.drawHeight = (this.canvas.height + 1000) / 2;
    this.isRotating = true;
    this.draw();
}

BackgroundCanvas.prototype.setVelocity = function({x}) {
    this.currentVelocity = x;
    this.stars.forEach(star => { star.velocity.x = this.currentVelocity; });
}

BackgroundCanvas.prototype.rotate = function() {
    this.rotateValue = 0.0005;
    this.backgroundRotateRadians = 0.0001;
    this.isRotating = true;
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
    if (this.isRotating && this.backgroundRotateRadians > 0) 
    {
        this.backgroundRotateRadians += this.rotateValue;
    }
    if (this.backgroundRotateRadians >= 2 * Math.PI) 
    {
        this.backgroundRotateRadians = 0;
    }
    /* 
     * beschleunigt sich, wenn sich zurücksetzt
     */
    if (this.isResetting)
    {
        this.rotateValue *= 1.01;
        if (this.backgroundRotateRadians <= 0)
        {
            this.backgroundRotateRadians = 0;
            this.isResetting = false;
        }
    }
    /*
     * zeichnet Sterne
     */
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
    this.isResetting = true;
    this.rotateValue = -(this.rotateValue + 0.001);
}

BackgroundCanvas.prototype.setBackgroundAlpha = function(alpha) {
    this.backgroundAlpha = alpha;
}

BackgroundCanvas.prototype._getRandomStar = function(x = random(-this.drawWidth, this.drawWidth)){
    const hue = random(70, 270);
    const opacity = (Math.random() / 2) + 0.2;
    const shadow = `rgba(${hue}, 171, 255, 1)`;
    const color = `rgba(${hue}, 171, 255, ${opacity})`;
    return {
        x,
        y: random(-this.drawHeight, this.drawHeight),
        radius: random(1, 2),
        color,
        shadow,
        ctx: this.ctx,
    };
}
//#endregion