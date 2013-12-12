/*global hfp*/
$(function() {

    var $body = jQuery('body'),
        $serializeBtn = jQuery('<button>serialize</button>')
            .on('click', serialize)
            .appendTo($body);

    function serialize() {
        console.log(hfp.gridster);
        var serialized = hfp.gridster.serialize();
        console.log(serialized);
        alert(JSON.stringify(serialized));
    }

});