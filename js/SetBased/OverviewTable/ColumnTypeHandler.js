/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global define */

//----------------------------------------------------------------------------------------------------------------------
define(
  'SetBased/OverviewTable/ColumnTypeHandler',

  [],

  function () {
    "use strict";
    //------------------------------------------------------------------------------------------------------------------
    function ColumnTypeHandler() {
      return this;
    }

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Returns true if the row filter must take this column filter in to account. Returns false otherwise.
     *
     * @returns {boolean}
     */
    ColumnTypeHandler.prototype.startFilter = function () {
      return false;
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Must be redefined if the column type handler needs special initialization.
     */
    ColumnTypeHandler.prototype.initHandler = function () {
      return null;
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Sets the appropriate classes of the column header and installs the appropriate event handlers on the column
     * header of the column of this column type handler.
     *
     * @param {SET_OverviewTable} overview_table  The overview table object of the table of the column of this column
     *                                            type handler.
     * @param {int}               column_index    The column index of the column of the table of the column of this
     *                                            column type handler.
     */
    ColumnTypeHandler.prototype.initSort = function (overview_table, column_index) {
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

            if (overview_table.myHeaderIndexLookup[column_index] ===
                overview_table.myHeaderIndexLookup[column_index - 1]) {
              width_col1 = overview_table.$myTable.children('tbody').
                children('tr:visible:first').find('td:eq(' + (column_index - 1) + ')').outerWidth();
              width_col2 = overview_table.$myTable.children('tbody').
                children('tr:visible:first').find('td:eq(' + column_index + ')').outerWidth();
            }

            if (overview_table.myHeaderIndexLookup[column_index] ===
                overview_table.myHeaderIndexLookup[column_index + 1]) {
              width_col1 = overview_table.$myTable.children('tbody').
                children('tr:visible:first').find('td:eq(' + column_index + ')').outerWidth();
              width_col2 = overview_table.$myTable.children('tbody').
                children('tr:visible:first').find('td:eq(' + (column_index + 1) + ')').outerWidth();
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

    //------------------------------------------------------------------------------------------------------------------
    return ColumnTypeHandler;
  }
);

//----------------------------------------------------------------------------------------------------------------------
