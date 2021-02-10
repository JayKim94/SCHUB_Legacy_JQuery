// Background stars for canvas
export function Star({x, y, radius, color, shadow, ctx}) {
    this.ctx = ctx;
    this.velocity = { x: 0, y: 0 };
    return this.reset({x, y, radius, color, shadow});
}

Star.prototype.reset = function({x, y, radius, color, shadow}) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.shadow = shadow;
}

Star.prototype.draw = function() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = this.shadow;
    this.ctx.fillStyle = this.shadow;
    this.ctx.fill();
    this.ctx.closePath();
}

Star.prototype.update = function() {
    this.x -= this.velocity.x;
    this.y -= this.velocity.y;
    this.draw();
};