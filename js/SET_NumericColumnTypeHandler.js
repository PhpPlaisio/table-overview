/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global window */
/*global $ */
/*global SET_TextColumnTypeHandler */
/*global SET_OverviewTable */

// ---------------------------------------------------------------------------------------------------------------------
function SET_NumericColumnTypeHandler() {
  "use strict";

  // Use parent constructor.
  SET_TextColumnTypeHandler.call(this);
}

// ---------------------------------------------------------------------------------------------------------------------
// Extend SET_NumericColumnTypeHandler from SET_TextColumnTypeHandler.
SET_NumericColumnTypeHandler.prototype = Object.create(SET_TextColumnTypeHandler.prototype);
// Set constructor for SET_NumericColumnTypeHandler.
SET_NumericColumnTypeHandler.constructor = SET_NumericColumnTypeHandler;

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Returns the numeric content of a table cell.
 *
 * @param {HTMLTableCellElement} table_cell The table cell.
 *
 * @returns {number}
 */
SET_NumericColumnTypeHandler.prototype.getSortKey = function (table_cell) {
  "use strict";
  var regexp;
  var parts;

  regexp = /[\d\.,\-\+]*/;
  parts = regexp.exec($(table_cell).text());

  // todo Better internationalisation.
  return parseInt(parts[0].replace('.', '').replace(',', '.'), 10);
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Compares two values of the column of this column type handler.
 *
 * @param {number} value1
 * @param {number} value2
 *
 * @returns {number}
 */
SET_NumericColumnTypeHandler.prototype.compareSortKeys = function (value1, value2) {
  "use strict";
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

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Register column type handler.
 */
SET_OverviewTable.registerColumnTypeHandler('numeric', SET_NumericColumnTypeHandler);

// ---------------------------------------------------------------------------------------------------------------------
