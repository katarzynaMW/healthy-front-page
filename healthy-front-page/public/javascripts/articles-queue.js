document.addEventListener('DOMContentLoaded', ready, false);

function ready() {
    var gridster = $(".gridster ul").gridster().data('gridster');

    $('.gridster').on("click", 'button', function() {
        gridster.remove_widget($(this).closest('li'));
        healthyFront.sendUpdate();

    });

    $('.drop-articles-here').on("click", 'button', function() {
        gridster.add_widget($(this).closest('li'));
        healthyFront.sendUpdate();
    });
}
