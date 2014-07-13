/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global window */
/*global $ */
/*global SET_NumericColumnTypeHandler */
/*global SET_OverviewTable */

// ---------------------------------------------------------------------------------------------------------------------
function SET_Ipv4ColumnTypeHandler() {
  "use strict";

  // Use parent constructor.
  SET_NumericColumnTypeHandler.call(this);
}

// ---------------------------------------------------------------------------------------------------------------------
// Extend SET_Ipv4ColumnTypeHandler from SET_NumericColumnTypeHandler.
SET_Ipv4ColumnTypeHandler.prototype = Object.create(SET_NumericColumnTypeHandler.prototype);
// Set constructor for SET_Ipv4ColumnTypeHandler.
SET_Ipv4ColumnTypeHandler.constructor = SET_Ipv4ColumnTypeHandler;

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Register column type handler.
 */
SET_OverviewTable.registerColumnTypeHandler('ipv4', SET_Ipv4ColumnTypeHandler);

// ---------------------------------------------------------------------------------------------------------------------
