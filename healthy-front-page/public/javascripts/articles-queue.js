document.addEventListener('DOMContentLoaded', ready, false);

function ready() {
    console.log('ready');
    var articleDataMap = 'data-id';
    var articlesQueue = new ArticlesQueue('.drop-articles-here', 'published', articleDataMap);

    var addCallback = function() {
        socket.emit('added', {});
    }

    $('.drop-articles-here').on("click",".article-add", function() {
        var parentId = $(this).closest('li').attr(articleDataMap);
        articlesQueue.add(parentId);
    });

    $('.gridster').on("click",".article-remove", function() {
        var parentId = $(this).closest('li').attr(articleDataMap);
        articlesQueue.add(parentId);
    });
}

function ArticlesQueue(id, publishedClassName, articleDataMap, addCb) {
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
            listElement.find('.article-add').removeClass('article-add').addClass('article-remove');
            gridster.add_widget(listElement);
            addCb();
        },
        remove: {

        }
    }
}
