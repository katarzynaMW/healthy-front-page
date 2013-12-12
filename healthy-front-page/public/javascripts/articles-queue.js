document.addEventListener('DOMContentLoaded', ready, false);

function ready() {
    var gridster = $(".gridster ul").gridster().data('gridster');

    $('.gridster').on("click", '.article-remove', function() {
        gridster.remove_widget($(this).closest('li'));
        hfp.sendUpdate();

    });

    $('.drop-articles-here').on("click", '.article-add', function() {
        $(this).removeClass('article-add').addClass('article-remove');
        gridster.add_widget($(this).closest('li'));
        hfp.sendUpdate();
    });
}
