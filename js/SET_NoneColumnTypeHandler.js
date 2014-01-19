/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global window */
/*global $ */
/*global SET_OverviewTable */

// ---------------------------------------------------------------------------------------------------------------------
function SET_NoneColumnTypeHandler() {
  "use strict";
}

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Returns false
 *
 * @returns {boolean}
 */
SET_NoneColumnTypeHandler.prototype.startFilter = function () {
  "use strict";
  return false;
};

// ---------------------------------------------------------------------------------------------------------------------
SET_NoneColumnTypeHandler.prototype.initFilter = function (overview_table, $table, header_index, column_index) {
  "use strict";
  var $cell;

  $cell = $table.children('thead').find('tr.filter').find('td').eq(header_index);
  $cell.html('');
  $cell.width($cell.css('width'));
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Register column type handlers.
 */
SET_OverviewTable.registerColumnTypeHandler('none', SET_NoneColumnTypeHandler);

// ---------------------------------------------------------------------------------------------------------------------
