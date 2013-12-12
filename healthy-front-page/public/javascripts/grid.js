hfp.gridster = $(".gridster ul").gridster({
    widget_margins         : [5, 5],
    widget_base_dimensions : [100, 100],
    autogenerate_stylesheet: true,
    resize                 : {
        enabled : true,
        max_size: [3, 3]
    },
    serialize_params       : function($w, wgd) {
        return {
            $el: $w,
            col: wgd.col,
            row: wgd.row,
            size_x: wgd.size_x,
            size_y: wgd.size_y
        }
    }
})
    .data('gridster'); // this extracts the API object from the jQ dom object