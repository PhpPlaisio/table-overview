/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global window */
/*global $ */
/*global SET_TextColumnTypeHandler */
/*global SET_OverviewTable */

// ---------------------------------------------------------------------------------------------------------------------
function SET_NumericColumnTypeHandler() {
  "use strict";
}

SET_NumericColumnTypeHandler.prototype = SET_TextColumnTypeHandler.prototype;

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Returns the numeric content of a table cell.
 *
 * @param {jquery} table_cell The table cell.
 *
 * @returns {Number}
 */
SET_NumericColumnTypeHandler.prototype.getSortKey = function (table_cell) {
  "use strict";
  var exp;

  exp = /[\d\.,\-\+]/g;

  return parseInt(exp.exec($(table_cell).text()).replace(',', '.'), 10);
};

// ---------------------------------------------------------------------------------------------------------------------
SET_NumericColumnTypeHandler.prototype.compareSortKeys = function (row1, row2) {
  "use strict";
  if (row1.sortKey === row2.sortKey) {
    return 0;
  }
  if (row1.sortKey === "" && !isNaN(row2.sortKey)) {
    return -1;
  }
  if (row2.sortKey === "" && !isNaN(row1.sortKey)) {
    return 1;
  }

  return row1.sortKey - row2.sortKey;
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Register column type handlers.
 */
SET_OverviewTable.registerColumnTypeHandler('numeric', SET_NumericColumnTypeHandler);

// ---------------------------------------------------------------------------------------------------------------------
