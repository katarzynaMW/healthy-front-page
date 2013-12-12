/*global hfp */
var hfp = hfp || {};
hfp.serializer1 = (function() {

    function serialize() {
        /* this was actually supposed to return the absolute things */

        var css = $('head style').last().html(),
            html = hfp.gridster.$el.html(),

            output = '<style>' + css + '</style>' + html;

        return output;
    }

    return {
        serialize: serialize
    }
})();