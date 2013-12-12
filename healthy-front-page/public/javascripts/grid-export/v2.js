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

    function serialize() {
        var serialized = hfp.gridster.serialize(),
            output = jQuery('<div></div>'),
            item,
            current_row,
            last_row_num = 1;

        serialized.sort(byPosition).reverse(); // popping is faster, but walks backwards

        current_row = new_row();
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
        }

        return output.html();
    }

    return {
        serialize: serialize
    }

})();