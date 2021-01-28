// Background stars for canvas
export function Star({x, y, radius, color, ctx}) {
    this.ctx = ctx;
    this.velocity = { x: 0, y: 0 };
    return this.reset({x, y, radius, color});
}
Star.prototype.reset = function({x, y, radius, color}) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
}
Star.prototype.draw = function() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.ctx.shadowBlur = 15;
    this.ctx.shadowColor = this.color;
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.closePath();
}
Star.prototype.update = function() {
    this.x -= this.velocity.x;
    this.y -= this.velocity.y;
    this.draw();
};