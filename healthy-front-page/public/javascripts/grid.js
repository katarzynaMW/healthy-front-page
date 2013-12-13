/*global healthyFront*/
healthyFront.sendUpdate = function() {
    var ser = healthyFront.serializer.serialize();
    socket.emit('preview', ser);

    // gridster adds lots of <style> tags, clean up all but the last
    // (yes, we don't keep other stuff in <style> tags)
    $('style:not(:last-of-type)').remove();
};

healthyFront.gridster = $(".gridster ul").gridster({
    widget_margins         : [5, 5],
    widget_base_dimensions : [150, 150], // IDEA: experiment with stuff like 150x80 with default 2x2 size, max 2x4
    autogenerate_stylesheet: true,
    max_cols               : 2,
    resize                 : {
        enabled : true,
        max_size: [2, 2], // todo change to 2,1 maybe
        stop    : healthyFront.sendUpdate,
        resize  : function(e, ui, $widget) {
            $widget.find('p.title').fitText();
        }
    },
    serialize_params       : function($w, wgd) {
        return {
            //$el: $w,
            id    : $w.data('id'),
            col   : wgd.col,
            row   : wgd.row,
            size_x: wgd.size_x,
            size_y: wgd.size_y
        }
    },
    draggable              : {
        stop: healthyFront.sendUpdate
    }
})
    .data('gridster'); // this extracts the API object from the jQ dom object
healthyFront.gridster.generate_stylesheet();

var interval, // for bad hackaround over a bug possibly caused by gridster
    pending = {}; // for not requesting the same ID if already being fetched

healthyFront.buildFromSerialized = function(serialized) {
    clearInterval(interval);
    console.log(serialized);
    console.log(+new Date());
    healthyFront.gridster.remove_all_widgets();
    $.each(serialized, function() {
        var id = this.id;
        console.log('processing id ' + id);
        healthyFront.gridster.add_widget('<li data-id="' + id + '" />',
            this.size_x, this.size_y, this.col, this.row);
    });
    // do not read the code below if you still respect us up to this point
    interval = setInterval(function() {
        $.each(serialized, function() {
            var $newTile, id = this.id;
            $newTile = $('.gridster li[data-id="' + id + '"]').eq(0);
            if (id && $newTile.find('article').length === 0) {
                // please populate me
                if (pending[id]) return;
                console.log('tile ' + id + ' needs populating');
                (function(id) {
                    pending[id] = true;
                    $.get('/article/' + id, function(data) {
                        healthyFront.log('got content for id ' + id, data);
                        $('.gridster li[data-id="' + id + '"]').append(data);
                        pending[id] = undefined;
                    })
                        .fail(function() {
                            // 404 ?
                            $('.gridster li[data-id="' + id + '"]').remove();
                        })
                })(id);
            }
        });
    }, 500);
    $('style:not(:last-of-type)').remove();
};
