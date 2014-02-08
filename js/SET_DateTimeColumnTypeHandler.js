/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global window */
/*global $ */
/*global SET_TextColumnTypeHandler */
/*global SET_OverviewTable */

// ---------------------------------------------------------------------------------------------------------------------
function SET_DateTimeColumnTypeHandler() {
  "use strict";
}

// ---------------------------------------------------------------------------------------------------------------------
SET_DateTimeColumnTypeHandler.prototype = Object.create(SET_TextColumnTypeHandler.prototype);
SET_DateTimeColumnTypeHandler.constructor = SET_DateTimeColumnTypeHandler;

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Returns the numeric content of a table cell.
 *
 * @param {object} table_cell The table cell.
 *
 * @returns {string}
 */
SET_DateTimeColumnTypeHandler.prototype.getSortKey = function (table_cell) {
  "use strict";
  var classes;
  var class_names;
  var ret = '';
  var i;

  classes = $(table_cell).attr('class');
  if (classes) {
    // Split all the classes of @a $cell into an array.
    class_names = classes.split(/\s+/);

    // Look for a class that starts with 'data-'.
    for (i = 0; i < class_names.length; i = i + 1) {
      if (class_names[i].substr(0, 5) === "data-") {
        ret = decodeURIComponent(class_names[i].substr(5).replace(/\+/g, '%20'));
        break;
      }
    }
  }

  return ret;
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Register column type handlers.
 */
SET_OverviewTable.registerColumnTypeHandler('date', SET_DateTimeColumnTypeHandler);
SET_OverviewTable.registerColumnTypeHandler('date-time', SET_DateTimeColumnTypeHandler);

// ---------------------------------------------------------------------------------------------------------------------
