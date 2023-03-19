module.exports = {
    create(context) {
        const source = context.getSourceCode();

        const isToken = (token) =>
            token.value === '?.' &&
            (token.type === 'Punctuator' || source.getText(token) === '?.');

        return {
            'CallExpression[optional=true]'(node) {
                context.report({
                    messageId: 'forbidden',
                    node: source.getTokenAfter(node.callee, isToken)
                });
            },
            'MemberExpression[optional=true]'(node) {
                context.report({
                    messageId: 'forbidden',
                    node: source.getTokenAfter(node.object, isToken)
                });
            }
        };
    },
    meta: {
        docs: {
            description: 'Disallow optional chaining operator',
            recommended: true
        },
        messages: {
            forbidden: 'Avoid using optional chaining operator'
        },
        schema: [],
        type: 'problem'
    }
};
