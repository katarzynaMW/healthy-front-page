/*global hfp */
var hfp = hfp || {};
hfp.serializer2 = (function() {

    var checkCell = function(cell) {
            return typeof cell === 'object' && typeof cell.row === 'number' && typeof cell.col === 'number';
        },
        byPosition = function byPosition(cell1, cell2) {
            // sanity checks, TODO: remove, some day
            if (!checkCell((cell1))) { throw Error('cell 1 is not a gridster cell'); }
            if (!checkCell((cell2))) { throw Error('cell 2 is not a gridster cell'); }

            return (cell1.row < cell2.row ? -1 : (cell2.row < cell1.row ? 1 : (cell1.col - cell2.col)));
        };

    function new_row() {
        return jQuery('<div class="gridRow"></div>');
    }


    function cloneObj(obj) {
        var clone = {};

        for (var i in obj) {
            if (obj[i] && typeof obj[i] == 'object') {
                clone[i] = cloneObj(obj[i]);
            } else {
                clone[i] = obj[i];
            }
        }
        return clone;
    }


    function serialize() {
        return hfp.gridster.serialize();
        /*var serialized = hfp.gridster.serialize(),
            output = jQuery('<div></div>'),
            item,
            current_row,
            last_row_num = 1,
            arrCopy;

        serialized.sort(byPosition); // popping is faster, but walks backwards*/

        //arrCopy = cloneObj(serialized);

        /*current_row = new_row();
        while (item = serialized.pop()) {
            var current_row_number = item.row;
            if (current_row_number != last_row_num) {
                output.append(current_row);
                current_row = new_row();
            }
            current_row.append(item.$el.clone()
                .addClass('gridUnit')
                .addClass('span' + item.size_x)
                .addClass('yspan' + item.size_y));
        }*/
/*
        return {
            serialized: arrCopy,
            html: output.html()
        };*/
    }

    return {
        serialize: serialize
    }

})();