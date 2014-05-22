/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global window */
/*global $ */
/*global SET_OverviewTable */

// ---------------------------------------------------------------------------------------------------------------------
function SET_ColumnTypeHandler() {
  "use strict";
}

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Returns true if the row filter must take this column filter in to account. Returns false otherwise.
 *
 * @returns {boolean}
 */
SET_ColumnTypeHandler.prototype.startFilter = function () {
  "use strict";

  return false;
};

// ---------------------------------------------------------------------------------------------------------------------
SET_ColumnTypeHandler.prototype.initSort = function (overview_table, column_index) {
  "use strict";
  var that = this;
  var $header;
  var x;
  var width_header;
  var width_col1;
  var width_col2;
  var diff;

  // Install event handler for click on sort icon.
  $header = overview_table.$myHeaders.eq(overview_table.myHeaderIndexLookup[column_index]);

  if ($header.hasClass('sort')) {
    $header.click(function (event) {
      overview_table.sort(event, $header, that, column_index);
    });
  } else if ($header.hasClass('sort-1') || $header.hasClass('sort-2')) {
    $header.click(function (event) {

      if ($header.hasClass('sort-1') && $header.hasClass('sort-2')) {

        x = event.pageX - $header.offset().left;

        if (overview_table.myHeaderIndexLookup[column_index] === overview_table.myHeaderIndexLookup[column_index - 1]) {
          width_col1 = overview_table.$myTable.find('tbody > tr:visible:first > td:eq(' + (column_index - 1) + ')').
            outerWidth();
          width_col2 = overview_table.$myTable.find('tbody > tr:visible:first > td:eq(' + column_index + ')').
            outerWidth();
        }

        if (overview_table.myHeaderIndexLookup[column_index] === overview_table.myHeaderIndexLookup[column_index + 1]) {
          width_col1 = overview_table.$myTable.find('tbody > tr:visible:first > td:eq(' + column_index + ')').
            outerWidth();
          width_col2 = overview_table.$myTable.find('tbody > tr:visible:first > td:eq(' + (column_index + 1) + ')').
            outerWidth();
        }

        width_header = $header.outerWidth();

        diff = width_header - width_col1 - width_col2;

        if (x > (width_col1 - diff / 2)) {
          if (overview_table.myHeaderIndexLookup[column_index] ===
              overview_table.myHeaderIndexLookup[column_index - 1]) {
            // Sort by right column.
            overview_table.sort(event, $header, that, column_index);
          }
        } else if (x < (width_col1 + diff / 2)) {
          if (overview_table.myHeaderIndexLookup[column_index] ===
              overview_table.myHeaderIndexLookup[column_index + 1]) {
            // Sort by left column.
            overview_table.sort(event, $header, that, column_index);
          }
        }
      } else if ($header.hasClass('sort-1')) {
        overview_table.sort(event, $header, that, column_index);
      } else if ($header.hasClass('sort-2')) {
        overview_table.sort(event, $header, that, column_index);
      }
    });
  }
};

// ---------------------------------------------------------------------------------------------------------------------
