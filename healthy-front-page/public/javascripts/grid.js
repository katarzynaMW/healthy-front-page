/*global hfp*/
hfp.sendUpdate = function() {
    var ser = hfp.serializer.serialize();
//    hfp.log('serialized grid', ser);
    socket.emit('preview', ser);
    $('style:not(:last-of-type)').remove();
};

hfp.gridster = $(".gridster ul").gridster({
    widget_margins         : [5, 5],
    widget_base_dimensions : [150, 150],
    autogenerate_stylesheet: true,
    max_cols               : 2,
    resize                 : {
        enabled : true,
        max_size: [2, 2], // todo change to 2,1 maybe
        stop    : hfp.sendUpdate
    },
    serialize_params       : function($w, wgd) {
        return {
            //$el: $w,
            col   : wgd.col,
            row   : wgd.row,
            size_x: wgd.size_x,
            size_y: wgd.size_y
        }
    },
    draggable              : {
        stop: hfp.sendUpdate
    }
})
    .data('gridster'); // this extracts the API object from the jQ dom object
hfp.gridster.generate_stylesheet();

hfp.buildFromSerialized = function(serialized) {
    hfp.gridster.remove_all_widgets();
    $.each(serialized, function() {
        hfp.gridster.add_widget('<li />', this.size_x, this.size_y, this.col, this.row);
    });
    $('style:not(:last-of-type)').remove();
};