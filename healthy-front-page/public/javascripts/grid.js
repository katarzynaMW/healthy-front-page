hfp.gridster = $(".gridster ul").gridster({
    widget_margins         : [5, 5],
    widget_base_dimensions : [100, 100],
    autogenerate_stylesheet: true,
    resize                 : {
        enabled : true,
        max_size: [3, 3]
    }
})
    .data('gridster'); // this extracts the API object from the jQ dom object