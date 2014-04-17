module.exports = attach;

function attach(fn) {
    if (!fn) {
        throw new Error('Nothing to attach');
    }

    return function* attach(next) {
        this.resource = fn(this.params.id);
        yield next;
    };
}