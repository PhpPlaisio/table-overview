/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global window */
/*global $ */
/*global SET_ColumnTypeHandler */
/*global SET_OverviewTable */

// ---------------------------------------------------------------------------------------------------------------------
function SET_TextColumnTypeHandler() {
  "use strict";
  // Use parent constructor.
  SET_ColumnTypeHandler.call(this);

  this.$myInput = null;
  this.myFilterValue = null;
}

// ---------------------------------------------------------------------------------------------------------------------
// Extend SET_TextColumnTypeHandler from SET_ColumnTypeHandler.
SET_TextColumnTypeHandler.prototype = Object.create(SET_ColumnTypeHandler.prototype);
// Set constructor for SET_TextColumnTypeHandler.
SET_TextColumnTypeHandler.constructor = SET_TextColumnTypeHandler;

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Returns true if the row filter must take this column filter in to account. Returns false otherwise.
 *
 * @returns {boolean}
 */
SET_TextColumnTypeHandler.prototype.startFilter = function () {
  "use strict";
  this.myFilterValue = SET_OverviewTable.toLowerCaseNoAccents(this.$myInput.val());

  // Note: this.myFilterValue might be undefined in case there is no input:text box for filtering in the column header.

  return (this.myFilterValue !== undefined && this.myFilterValue !== '');
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Returns true if the table (based on this column filter) must be shown. Returns false otherwise.
 *
 * @param table_cell
 *
 * @returns {boolean}
 */
SET_TextColumnTypeHandler.prototype.simpleFilter = function (table_cell) {
  "use strict";
  var value;

  value = this.extractForFilter(table_cell);

  return (value.indexOf(this.myFilterValue) !== -1);
};

// ---------------------------------------------------------------------------------------------------------------------
SET_TextColumnTypeHandler.prototype.initFilter = function (overview_table, column_index) {
  "use strict";
  var that = this;

  this.$myInput = overview_table.$myFilters.eq(column_index).find('input');

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
  this.$myInput.keyup({ table: overview_table, element: this.$myInput}, SET_OverviewTable.filterTrigger);

  // Resize the input box.
  this.$myInput.width(this.$myInput.width() +
    (this.$myInput.closest('td').innerWidth() - this.$myInput.outerWidth(true)));
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Returns the text content of a table_cell.
 *
 * @param {HTMLTableElement} table_cell The table cell.
 *
 * @returns {string}
 */
SET_TextColumnTypeHandler.prototype.extractForFilter = function (table_cell) {
  "use strict";
  return SET_OverviewTable.toLowerCaseNoAccents($(table_cell).text());
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Returns the text content of a table cell.
 *
 * @param {HTMLTableCellElement} table_cell The table cell.
 *
 * @returns {string}
 */
SET_TextColumnTypeHandler.prototype.getSortKey = function (table_cell) {
  "use strict";
  return SET_OverviewTable.toLowerCaseNoAccents($(table_cell).text());
};


// ---------------------------------------------------------------------------------------------------------------------
/**
 * Compares two values of the column of this column type handler.
 *
 * @param {string} value1
 * @param {string} value2
 *
 * @returns {number}
 */
SET_TextColumnTypeHandler.prototype.compareSortKeys = function (value1, value2) {
  "use strict";
  if (value1 < value2) {
    return -1;
  }
  if (value1 > value2) {
    return 1;
  }

  return 0;
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Register column type handlers.
 */
SET_OverviewTable.registerColumnTypeHandler('text', SET_TextColumnTypeHandler);
SET_OverviewTable.registerColumnTypeHandler('email', SET_TextColumnTypeHandler);
