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

      this.$input = null;
      this.filterValue = null;
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
      this.filterValue = OverviewTable.toLowerCaseNoDiacritics(this.$input.val());

      // Note: this.filterValue might be undefined in case there is no input:text box for filtering in the column 
      // header.

      return (typeof this.filterValue !== 'undefined' && this.filterValue !== '');
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
      let value;

      value = this.extractForFilter(tableCell);

      return (value.indexOf(this.filterValue) !== -1);
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * @param {MediaQueryList} mq The media query list object (must match for small screens).
     */
    Text.prototype.mediaChange = function (mq) {
      this.$input.width('');

      if (mq === undefined || mq.matches === false) {
        // Large screen.
        this.$input.width(this.$input.width() +
          (this.$input.closest('td').innerWidth() - this.$input.outerWidth(true)));
      }
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * @param {OverviewTable} overviewTable The overview table.
     * @param {int}  columnIndex The index of the column in the table.
     * @param {MediaQueryList} mq The media query list object (must match for small screens).
     */
    Text.prototype.initFilter = function (overviewTable, columnIndex, mq) {
      let that = this;

      this.$input = overviewTable.$filters.eq(columnIndex).find('input');

      // Clear the filter box (some browsers preserve the values on page reload).
      this.$input.val('');

      // Install event handler for ESC-key pressed in filter.
      this.$input.keyup(function (event) {
        // If the ESC-key was pressed or nothing is entered clear the value of the search box.
        if (event.keyCode === 27) {
          that.$input.val('');
        }
      });

      // Install event handler for changed filter value.
      this.$input.keyup({table: overviewTable, element: this.$input}, OverviewTable.filterTrigger);

      // Install and fire media query event handler.
      //mq.addListener(function (mq) {that.mediaChange(mq);});
      // $(window).resize(function (mq) {that.mediaChange(mq);});
      this.mediaChange(mq);
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
      return OverviewTable.toLowerCaseNoDiacritics($(tableCell).text());
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
      return OverviewTable.toLowerCaseNoDiacritics($(tableCell).text());
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Compares two values of the column of this column type handler.
     *
     * @param {string} value1 The first value.
     * @param {string} value2 The second value.
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
