class Calculator {
    constructor() {
        this.methods = {};
    }

    addMethod(operation, func) {
        if (typeof operation !== 'string' || typeof func !== 'function') {
            throw new Error('INVALID_ARGUMENT');
        }
        this.methods[operation] = func;
    }

    calculate(expression) {
        if (typeof expression !== 'string') {
            throw new Error('INVALID_ARGUMENT');
        }

        const [a, operation, b] = expression.split(' ');

        if (isNaN(a) || isNaN(b) || !this.methods[operation]) {
            if (!this.methods[operation]) {
                throw new Error('UNKNOWN_OPERATION');
            } else {
                throw new Error('INVALID_OPPERAND');
            }
        }

        const firstNumber = Number(a);
        const secondNumber = Number(b);

        return this.methods[operation](firstNumber, secondNumber);
    }
}