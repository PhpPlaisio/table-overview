/*global define */

//----------------------------------------------------------------------------------------------------------------------
define(
  'SetBased/Abc/Table/ColumnTypeHandler/None',

  ['SetBased/Abc/Table/OverviewTable',
    'SetBased/Abc/Table/ColumnTypeHandler/ColumnTypeHandler'],

  function (OverviewTable, ColumnTypeHandler) {
    'use strict';
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
    None.prototype.initSort = function (overviewTable, columnIndex) {
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

    //------------------------------------------------------------------------------------------------------------------
  }
);

//----------------------------------------------------------------------------------------------------------------------
