
const generate = (error, message, data) => {
    return {
        error: error,
        message: message,
        data: data
    };
};

const error = (msg) => {
    return {
        error: true,
        message: !msg ? 'Opps invalid request' : msg,
        data: {}
    };
};

module.exports = {
    generate: generate,
    error: error
};