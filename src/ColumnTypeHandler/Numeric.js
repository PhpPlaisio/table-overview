/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global define */

//----------------------------------------------------------------------------------------------------------------------
define(
  'SetBased/Abc/Table/ColumnTypeHandler/Numeric',

  ['jquery',
    'SetBased/Abc/Table/OverviewTable',
    'SetBased/Abc/Table/ColumnTypeHandler/Text'],

  function ($, OverviewTable, Text) {
    "use strict";
    //------------------------------------------------------------------------------------------------------------------
    function Numeric() {
      // Use parent constructor.
      Text.call(this);
    }

    //------------------------------------------------------------------------------------------------------------------
    // Extend Numeric from Text.
    Numeric.prototype = Object.create(Text.prototype);
    // Set constructor for Numeric.
    Numeric.constructor = Numeric;

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Returns the numeric content of a table cell.
     *
     * @param {HTMLTableCellElement} table_cell The table cell.
     *
     * @returns {number}
     */
    Numeric.prototype.getSortKey = function (table_cell) {
      var regexp;
      var parts;

      regexp = /[\d\.,\-\+]*/;
      parts = regexp.exec($(table_cell).text());

      // todo Better internationalisation.
      return parseInt(parts[0].replace('.', '').replace(',', '.'), 10);
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Compares two values of the column of this column type handler.
     *
     * @param {number} value1
     * @param {number} value2
     *
     * @returns {number}
     */
    Numeric.prototype.compareSortKeys = function (value1, value2) {
      if (value1 === value2) {
        return 0;
      }
      if (value1 === "" && !isNaN(value2)) {
        return -1;
      }
      if (value2 === "" && !isNaN(value1)) {
        return 1;
      }

      return value1 - value2;
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Register column type handler.
     */
    OverviewTable.registerColumnTypeHandler('numeric', Numeric);

    //------------------------------------------------------------------------------------------------------------------
    return Numeric;

    //------------------------------------------------------------------------------------------------------------------
  }
);

//----------------------------------------------------------------------------------------------------------------------
