/*global healthyFront */
var healthyFront = healthyFront || {};
healthyFront.serializer1 = (function() {

    function serialize() {
        /* this was actually supposed to return the absolute things */

        var css = $('head style').last().html(),
            html = healthyFront.gridster.$el.html(),

            output = '<style>' + css + '</style>' + html;

        return output;
    }

    return {
        serialize: serialize
    }
})();