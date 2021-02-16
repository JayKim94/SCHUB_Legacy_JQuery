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
        case '÷':
            res = this.op1 / this.op2;
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
    if (this.op1 > 50) {
        const chanceForDiv = .55;
        const roll = Math.random();
        if (roll < chanceForDiv && this.op1 % 5 == 0)
        {
            this.operator = '÷';
            this.op2 = 5;
        }
        else if (roll < chanceForDiv && this.op1 % 3 == 0)
        {
            this.operator = '÷';
            this.op2 = 3;
        }
        else
        {
            this.operator = '-';
            this.op2 = random(5, 9);
        }
    }
    else if (this.op1 > 30) {
        const chanceForPlus = .45;
        if (this.op1 % 5 == 0)
        {
            this.operator = '÷';
            this.op2 = 5;
        }
        else if (Math.random() < chanceForPlus) 
        {
            this.operator = '+';
            this.op2 = random(2, 6);
        }
        else 
        {
            this.operator = '-';
            this.op2 = random(7, 9);
        }
    }
    else if (this.op1 >= 10) {
        const chanceForPlus = .45;
        const chanceForDiv = .35;
        const chanceForMulti = .25;
        const roll = Math.random();
        if (roll < chanceForDiv && this.op1 % 3 == 0)
        {
            this.operator = '÷';
            this.op2 = 3;
        }
        else if (roll < chanceForMulti && this.op1 < 15)
        {
            this.op2 = random(2, 5);
        }
        else if (roll < chanceForPlus) 
        {
            this.operator = '+';
            this.op2 = random(3, 9);
        }
        else 
        {
            this.operator = '-';
            this.op2 = random(4, 9);
        };
    }
    else {
        const chanceForMulti = .55;
        const roll = Math.random();
        if (roll < chanceForMulti) 
        {
            this.operator = '*';
            this.op2 = random(2, 7);
        }
        else 
        {
            this.operator = '+'
            this.op2 = random(5, 9);
        };
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