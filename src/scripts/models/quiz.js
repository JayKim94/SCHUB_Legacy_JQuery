import { random } from '../utils.js';
// Quiz data model
export function Quiz({op1, op2, operator}) {
    this.op1 = op1;
    this.op2 = op2;
    this.operator = operator;
}
Quiz.prototype.answer = function() {
    let res;
    switch (this.operator) {
        case '+':
            res = this.op1 + this.op2;
            break;
        case '-':
            res = this.op1 - this.op2;
            break;
        default:
            res = undefined;
            break;             
    }
    return res;
}
Quiz.prototype.next = function() {
    this.op1 = this.answer();
    this.op2 = random(1, 9);
    if (this.op1 > 30) {
        if (Math.random() < .15) this.operator = '+';
        else this.operator = '-';
    }
    else if (this.op1 > 10) {
        if (Math.random() < .55) this.operator = '+';
        else this.operator = '-';
    }
    else {
        this.operator = '+';
    }
}
Quiz.prototype.currentMap = function() {
    return new Map([
        ['op1', this.op1],
        ['operator', this.operator],
        ['op2', this.op2],
        ['eq', '='],
    ]);
}