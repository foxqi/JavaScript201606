/**
 * Created by “¯≈Ù on 2016/7/30.
 */
var bottleList = [];


module.exports = {
    get: function () {
        var index = Math.floor(Math.random() * bottleList.length);
        var note = bottleList[index];
        return this.normalize({
            content: note,
            errno: 0
        });
    },
    set: function (note) {
        bottleList.push(note);
        return this.normalize({errno: 0});
    },
    normalize: function (data) {
        return JSON.stringify(data);
    }
};