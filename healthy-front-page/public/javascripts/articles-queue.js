document.addEventListener('DOMContentLoaded', ready, false);

function ready() {
    console.log('ready');
    var articleDataMap = 'data-id';
    var articlesQueue = new ArticlesQueue('.drop-articles-here', 'published', articleDataMap);

        $('.drop-articles-here').on("click",".article-add", function() {
            var parentId = $(this).closest('li').attr(articleDataMap);
            articlesQueue.add(parentId);
        });
}

function ArticlesQueue(id, publishedClassName, articleDataMap) {
    var gridster = $(".gridster ul").gridster().data('gridster');
    return {
        add: function(articleId) {
            //remove from fp list
            var articlesDOMList = $(id).children();
            var listElement = articlesDOMList.filter(function(index){
                if(articlesDOMList[index].getAttribute(articleDataMap) == articleId) {
                    return true;
                }
            });
            listElement.addClass(publishedClassName);
            var article = listElement.html();
            gridster.add_widget(article);
        },
        remove: {

        }
    }
}
