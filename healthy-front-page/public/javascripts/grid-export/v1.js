/*global hfp*/
$(function() {

    var $body = jQuery('body'),
        $serializeBtn = jQuery('<button>serialize v1</button>')
            .on('click', serialize)
            .appendTo($body),
        log = function(stuff) {
            if (typeof stuff === 'string') {
                console.log('[grid-export basic] ' + stuff)
            } else {
                console.group('[grid-export basic]');
                console.dir(stuff);
                console.groupEnd();
            }
        }

    function serialize() {
        /* this was actually supposed to return the absolute things */

        var css = $('head style').last().html(),
            html = hfp.gridster.$el.html(),

            output = '<style>' + css + '</style>' + html;

        log({css: css, html: html, output: output});
    }

});