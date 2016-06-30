/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global define */

//----------------------------------------------------------------------------------------------------------------------
define(
  'SetBased/Abc/Table/ColumnTypeHandler/Text',

  ['jquery',
    'SetBased/Abc/Table/OverviewTable',
    'SetBased/Abc/Table/ColumnTypeHandler/ColumnTypeHandler'],

  function ($, OverviewTable, ColumnTypeHandler) {
    'use strict';
    //------------------------------------------------------------------------------------------------------------------
    function Text() {
      // Use parent constructor.
      ColumnTypeHandler.call(this);

      this.$myInput = null;
      this.myFilterValue = null;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Extend Text from ColumnTypeHandler.
    Text.prototype = Object.create(ColumnTypeHandler.prototype);
    // Set constructor for Text.
    Text.constructor = Text;

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Returns true if the row filter must take this column filter in to account. Returns false otherwise.
     *
     * @returns {boolean}
     */
    Text.prototype.startFilter = function () {
      this.myFilterValue = OverviewTable.toLowerCaseNoAccents(this.$myInput.val());

      // Note: this.myFilterValue might be undefined in case there is no input:text box for filtering in the column 
      // header.

      return (this.myFilterValue !== undefined && this.myFilterValue !== '');
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Returns true if the table (based on this column filter) must be shown. Returns false otherwise.
     *
     * @param tableCell
     *
     * @returns {boolean}
     */
    Text.prototype.simpleFilter = function (tableCell) {
      var value;

      value = this.extractForFilter(tableCell);

      return (value.indexOf(this.myFilterValue) !== -1);
    };

    //------------------------------------------------------------------------------------------------------------------
    Text.prototype.initFilter = function (overviewTable, columnIndex) {
      var that = this;

      this.$myInput = overviewTable.$myFilters.eq(columnIndex).find('input');

      // Clear the filter box (some browsers preserve the values on page reload).
      this.$myInput.val('');

      // Install event handler for ESC-key pressed in filter.
      this.$myInput.keyup(function (event) {
        // If the ESC-key was pressed or nothing is entered clear the value of the search box.
        if (event.keyCode === 27) {
          that.$myInput.val('');
        }
      });

      // Install event handler for changed filter value.
      this.$myInput.keyup({table: overviewTable, element: this.$myInput}, OverviewTable.filterTrigger);

      // Resize the input box.
      this.$myInput.width(this.$myInput.width() +
        (this.$myInput.closest('td').innerWidth() - this.$myInput.outerWidth(true)));
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Returns the text content of a table_cell.
     *
     * @param {HTMLTableElement} tableCell The table cell.
     *
     * @returns {string}
     */
    Text.prototype.extractForFilter = function (tableCell) {
      return OverviewTable.toLowerCaseNoAccents($(tableCell).text());
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Returns the text content of a table cell.
     *
     * @param {HTMLTableCellElement} tableCell The table cell.
     *
     * @returns {string}
     */
    Text.prototype.getSortKey = function (tableCell) {
      return OverviewTable.toLowerCaseNoAccents($(tableCell).text());
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Compares two values of the column of this column type handler.
     *
     * @param {string} value1
     * @param {string} value2
     *
     * @returns {number}
     */
    Text.prototype.compareSortKeys = function (value1, value2) {
      if (value1 < value2) {
        return -1;
      }
      if (value1 > value2) {
        return 1;
      }

      return 0;
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Register column type handlers.
     */
    OverviewTable.registerColumnTypeHandler('text', Text);
    OverviewTable.registerColumnTypeHandler('email', Text);

    //------------------------------------------------------------------------------------------------------------------
    return Text;

    //------------------------------------------------------------------------------------------------------------------
  }
);

//----------------------------------------------------------------------------------------------------------------------
