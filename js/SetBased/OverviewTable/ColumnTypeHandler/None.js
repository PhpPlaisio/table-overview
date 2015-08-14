/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global define */

//----------------------------------------------------------------------------------------------------------------------
define(
  'SetBased/OverviewTable/ColumnTypeHandler/None',

  ['SetBased/OverviewTable',
    'SetBased/OverviewTable/ColumnTypeHandler'],

  function (OverviewTable, ColumnTypeHandler) {
    "use strict";
    //------------------------------------------------------------------------------------------------------------------
    function None() {
      // Use parent constructor.
      ColumnTypeHandler.call(this);
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Extend None from ColumnTypeHandler.
    None.prototype = Object.create(ColumnTypeHandler.prototype);
    // Set constructor for None.
    None.constructor = None;

    // -----------------------------------------------------------------------------------------------------------------
    None.prototype.initSort = function (overview_table, column_index) {
      return null;
    };

    // -----------------------------------------------------------------------------------------------------------------
    None.prototype.initFilter = function () {
      return null;
    };

    // -----------------------------------------------------------------------------------------------------------------
    /**
     * Register column type handler.
     */
    OverviewTable.registerColumnTypeHandler('none', None);

    //------------------------------------------------------------------------------------------------------------------
    return None;
  }
);

//----------------------------------------------------------------------------------------------------------------------
