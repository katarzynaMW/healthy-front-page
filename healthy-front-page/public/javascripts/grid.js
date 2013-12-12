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
            id    : function() {
                console.log($w.data('id'));
                return $w.data('id');
            }(),
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
        var $newTile, id = this.id;
        console.log('processing id ' + id);
        hfp.gridster.add_widget('<li data-id="' + id + '" />', this.size_x, this.size_y, this.col, this.row);
        $newTile = $('.gridster li[data-id="' + id + '"]').eq(0);
        if (id && $newTile.find('article').length === 0) {
            // please populate me
            console.log('tile ' + id + ' needs populating');
            (function(id) {
                $.get('/article/' + id, function(data) {
                    $newTile.html(data);
                });
            })(id);
        }
    });
    $('style:not(:last-of-type)').remove();
};