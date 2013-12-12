document.addEventListener('DOMContentLoaded', ready, false);

function ready() {
    var articlesQueue = new ArticlesQueue('.drop-articles-here', 'published', 'data-id');

    attachClickEvt('.drop-articles-here', '.article-add',articlesQueue.add);
    attachClickEvt('.gridster', '.article-remove',articlesQueue.remove);

//    $('.drop-articles-here').on("click",".article-add", function() {
//        var parentId = $(this).closest('li').attr(articleDataMap);
//        articlesQueue.add(parentId);
//    });
//
//    $('.gridster').on("click",".article-remove", function() {
//        var parentId = $(this).closest('li').attr(articleDataMap);
//        articlesQueue.remove(parentId);
//    });
}

function ArticlesQueue(id, publishedClassName, articleDataMapName, addCb) {
    var gridster = $(".gridster ul").gridster().data('gridster');
    return {
        add: function(articleId) {
            var listElement = findChildElementWithArticleId(articleId, id, articleDataMapName);
            listElement.find('.article-add').removeClass('article-add').addClass('article-remove');
            gridster.add_widget(listElement);
            hfp.sendUpdate();
        },
        remove: function(articleId){
            var listElement = findChildElementWithArticleId(articleId, '.gridster ul', articleDataMapName);
            gridster.remove_widget(listElement);
            hfp.sendUpdate();
        }
    }
}

function findChildElementWithArticleId(articleId, parentEl, articleDataMapName) {
    var articlesDOMList = $(parentEl).children();
    var listElement = articlesDOMList.filter(function(index){
        if(articlesDOMList[index].getAttribute(articleDataMapName) == articleId) {
            return true;
        }
    });
    return listElement;

}

function attachClickEvt(parentElement, childElement, articleQueueFunction) {
    $(parentElement).on("click", childElement, function() {
        var parentId = $(this).closest('li').attr('data-id');
        articleQueueFunction(parentId);
    });
}
