import { random } from '../utils.js';
// Quiz data model
export function Quiz() {
    this.init();
}
Quiz.prototype.init = function() {
    this.op1 = random(1, 9);
    this.op2 = random(1, 9);
    this.operator = '+';
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
        case '*':
            res = this.op1 * this.op2;
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
        const chanceForPlus = .15;
        if (Math.random() < chanceForPlus) this.operator = '+';
        else this.operator = '-';
    }
    else if (this.op1 > 10) {
        const chanceForPlus = .35;
        if (Math.random() < chanceForPlus) this.operator = '+';
        else this.operator = '-';
    }
    else {
        const chanceForMulti = 1;
        if (Math.random() < chanceForMulti) this.operator = '*';
        else this.operator = '+';
    }
    return this;
}
Quiz.prototype.currentMap = function() {
    return new Map([
        ['op1', this.op1],
        ['operator', this.operator],
        ['op2', this.op2],
        ['eq', '='],
    ]);
}