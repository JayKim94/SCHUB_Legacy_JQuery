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
            res = this.op1 + this.op2;
            break;                
    }
    return res;
}
Quiz.prototype.next = function() {
    this.op1 = this.answer();
    this.op2 = random(1, 9);
    this.operator = '+';
}