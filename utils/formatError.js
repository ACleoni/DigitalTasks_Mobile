const formatError = (e) => {
    if (e.error) {
        return e.error[0].message;
    }
    return e;
}

module.exports = formatError;