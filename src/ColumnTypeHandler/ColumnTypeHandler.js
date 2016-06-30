/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global define */

//----------------------------------------------------------------------------------------------------------------------
define(
  'SetBased/Abc/Table/ColumnTypeHandler/ColumnTypeHandler',

  [],

  function () {
    'use strict';
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
     * @param {OverviewTable} overviewTable  The overview table object of the table of the column of this column
     *                                       type handler.
     * @param {int}           columnIndex    The column index of the column of the table of the column of this
     *                                       column type handler.
     */
    ColumnTypeHandler.prototype.initSort = function (overviewTable, columnIndex) {
      var that = this;
      var $header;
      var x;
      var widthHeader;
      var widthCol1 = 0;
      var widthCol2 = 0;
      var diff;

      // Install event handler for click on sort icon.
      $header = overviewTable.$headers.eq(overviewTable.headerIndexLookup[columnIndex]);

      if ($header.hasClass('sort')) {
        $header.click(function (event) {
          overviewTable.sort(event, $header, that, columnIndex);
        });
      } else if ($header.hasClass('sort-1') || $header.hasClass('sort-2')) {
        $header.click(function (event) {
          if ($header.hasClass('sort-1') && $header.hasClass('sort-2')) {
            x = event.pageX - $header.offset().left;

            if (overviewTable.headerIndexLookup[columnIndex] ===
              overviewTable.headerIndexLookup[columnIndex - 1]) {
              widthCol1 = overviewTable.$table.children('tbody').children('tr:visible:first').find('td:eq(' + (columnIndex - 1) + ')').outerWidth();
              widthCol2 = overviewTable.$table.children('tbody').children('tr:visible:first').find('td:eq(' + columnIndex + ')').outerWidth();
            }

            if (overviewTable.headerIndexLookup[columnIndex] ===
              overviewTable.headerIndexLookup[columnIndex + 1]) {
              widthCol1 = overviewTable.$table.children('tbody').children('tr:visible:first').find('td:eq(' + columnIndex + ')').outerWidth();
              widthCol2 = overviewTable.$table.children('tbody').children('tr:visible:first').find('td:eq(' + (columnIndex + 1) + ')').outerWidth();
            }

            widthHeader = $header.outerWidth();

            diff = widthHeader - widthCol1 - widthCol2;

            if (x > (widthCol1 - diff / 2)) {
              if (overviewTable.headerIndexLookup[columnIndex] ===
                overviewTable.headerIndexLookup[columnIndex - 1]) {
                // Sort by right column.
                overviewTable.sort(event, $header, that, columnIndex);
              }
            } else if (x < (widthCol1 + diff / 2)) {
              if (overviewTable.headerIndexLookup[columnIndex] ===
                overviewTable.headerIndexLookup[columnIndex + 1]) {
                // Sort by left column.
                overviewTable.sort(event, $header, that, columnIndex);
              }
            }
          } else if ($header.hasClass('sort-1')) {
            overviewTable.sort(event, $header, that, columnIndex);
          } else if ($header.hasClass('sort-2')) {
            overviewTable.sort(event, $header, that, columnIndex);
          }
        });
      }
    };

    //------------------------------------------------------------------------------------------------------------------
    return ColumnTypeHandler;

    //------------------------------------------------------------------------------------------------------------------
  }
);

//----------------------------------------------------------------------------------------------------------------------
