/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global window */
/*global $ */
/*global SET_TextColumnTypeHandler */
/*global SET_OverviewTable */

// ---------------------------------------------------------------------------------------------------------------------
function SET_UuidColumnTypeHandler() {
  "use strict";

  // Use parent constructor.
  SET_TextColumnTypeHandler.call(this);
}

// ---------------------------------------------------------------------------------------------------------------------
// Extend SET_UuidColumnTypeHandler from SET_TextColumnTypeHandler.
SET_UuidColumnTypeHandler.prototype = Object.create(SET_TextColumnTypeHandler.prototype);
// Set constructor for SET_UuidColumnTypeHandler.
SET_UuidColumnTypeHandler.constructor = SET_UuidColumnTypeHandler;

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Register column type handler.
 */
SET_OverviewTable.registerColumnTypeHandler('uuid', SET_UuidColumnTypeHandler);

// ---------------------------------------------------------------------------------------------------------------------
