$(function() {

    var $body = jQuery('body'),
        $btn = jQuery('<button>test</button>').on('click', btnClick).appendTo($body);

    function btnClick() {
        alert('hello');
    }

});