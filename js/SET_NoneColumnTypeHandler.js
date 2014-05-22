/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global window */
/*global $ */
/*global SET_ColumnTypeHandler */
/*global SET_OverviewTable */

// ---------------------------------------------------------------------------------------------------------------------
function SET_NoneColumnTypeHandler() {
  "use strict";

  // Use parent constructor.
  SET_ColumnTypeHandler.call(this);
}

// ---------------------------------------------------------------------------------------------------------------------
// Extend SET_NoneColumnTypeHandler from SET_ColumnTypeHandler.
SET_NoneColumnTypeHandler.prototype = Object.create(SET_ColumnTypeHandler.prototype);
// Set constructor for SET_NoneColumnTypeHandler.
SET_NoneColumnTypeHandler.constructor = SET_NoneColumnTypeHandler;

// ---------------------------------------------------------------------------------------------------------------------
SET_NoneColumnTypeHandler.prototype.initSort = function () {
  "use strict";
};

// ---------------------------------------------------------------------------------------------------------------------
SET_NoneColumnTypeHandler.prototype.initFilter = function () {
  "use strict";
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Register column type handler.
 */
SET_OverviewTable.registerColumnTypeHandler('none', SET_NoneColumnTypeHandler);

// ---------------------------------------------------------------------------------------------------------------------
