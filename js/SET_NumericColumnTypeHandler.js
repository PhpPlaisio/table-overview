/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global window */
/*global $ */
/*global SET_TextColumnTypeHandler */
/*global SET_OverviewTable */

// ---------------------------------------------------------------------------------------------------------------------
function SET_NumericColumnTypeHandler() {
  "use strict";
}

// ---------------------------------------------------------------------------------------------------------------------
SET_NumericColumnTypeHandler.prototype = Object.create(SET_TextColumnTypeHandler.prototype);
SET_NumericColumnTypeHandler.constructor = SET_NumericColumnTypeHandler;

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Returns the numeric content of a table cell.
 *
 * @param {object} table_cell The table cell.
 *
 * @returns {Number}
 */
SET_NumericColumnTypeHandler.prototype.getSortKey = function (table_cell) {
  "use strict";
  var regexp;
  var parts;

  regexp = /[\d\.,\-\+]*/;
  parts = regexp.exec($(table_cell).text());

  return parseInt(parts[0].replace(',', '.'), 10);
};

// ---------------------------------------------------------------------------------------------------------------------
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
 * Register column type handlers.
 */
SET_OverviewTable.registerColumnTypeHandler('numeric', SET_NumericColumnTypeHandler);

// ---------------------------------------------------------------------------------------------------------------------
