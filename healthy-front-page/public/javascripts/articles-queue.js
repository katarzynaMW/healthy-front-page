function ArticlesQueue(id) {
    return {
        add: function(articleId) {
            //remove from fp list
            var articlesDOMList = $(id).children();
            var articleDom = articlesDOMList.filter(function(index){
                if(articlesDOMList[index].getAttribute('id') == articleId) {
                    return true;
                }
            });
            articleDom.addClass('published');
            //add to gridster


        }
    }
}
