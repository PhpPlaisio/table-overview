/*global define */

//----------------------------------------------------------------------------------------------------------------------
define(
  'SetBased/Abc/Table/ColumnTypeHandler/DateTime',

  ['jquery',
    'SetBased/Abc/Table/OverviewTable',
    'SetBased/Abc/Table/ColumnTypeHandler/Text'],

  function ($, OverviewTable, Text) {
    'use strict';
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
     * @param {HTMLTableCellElement} tableCell The table cell.
     *
     * @returns {string}
     */
    DateTime.prototype.getSortKey = function (tableCell) {
      return $(tableCell).attr('data-value');
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
