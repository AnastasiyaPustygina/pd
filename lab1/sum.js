function sum(...args) {
    if (args.length < 2) {
        throw new Error('INVALID_ARGUMENTS_COUNT');
    }

    for (const arg of args) {
        if (typeof arg !== 'number') {
            throw new Error('INVALID_ARGUMENT');
        }
    }
    return args.reduce((acc, curr) => acc + curr, 0);
}

try {
    console.log(sum(1, 2, 3));
    console.log(sum());
    console.log(sum(0, 1, '1', 2));
} catch (error) {
    console.error(error.message);
}