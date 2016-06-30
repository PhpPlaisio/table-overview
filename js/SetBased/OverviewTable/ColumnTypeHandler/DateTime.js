/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global define */

//----------------------------------------------------------------------------------------------------------------------
define(
  'SetBased/Abc/Table/ColumnTypeHandler/DateTime',

  ['jquery',
    'SetBased/Abc/Table/OverviewTable',
    'SetBased/Abc/Table/ColumnTypeHandler/Text'],

  function ($, OverviewTable, Text) {
    "use strict";
    //------------------------------------------------------------------------------------------------------------------
    function DateTime() {
      // Use parent constructor.
      Text.call(this);
    }

    //------------------------------------------------------------------------------------------------------------------
    // Extend DateTime from Text.
    DateTime.prototype = Object.create(Text.prototype);
    // Set constructor for DateTime.
    DateTime.constructor = DateTime;

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Returns the date or datetime content of a table cell.
     *
     * @param {HTMLTableCellElement} table_cell The table cell.
     *
     * @returns {string}
     */
    DateTime.prototype.getSortKey = function (table_cell) {
      return $(table_cell).data('value');
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Register column type handlers.
     */
    OverviewTable.registerColumnTypeHandler('date', DateTime);
    OverviewTable.registerColumnTypeHandler('datetime', DateTime);

    //------------------------------------------------------------------------------------------------------------------
    return DateTime;

    //------------------------------------------------------------------------------------------------------------------
  }
);

//----------------------------------------------------------------------------------------------------------------------
