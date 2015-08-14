/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global define */

//----------------------------------------------------------------------------------------------------------------------
define(
  'SetBased/OverviewTable/ColumnTypeHandler/Uuid',

  ['SetBased/OverviewTable',
    'SetBased/OverviewTable/ColumnTypeHandler/Text'],

  function (OverviewTable, Text) {
    "use strict";
    //------------------------------------------------------------------------------------------------------------------
    /**
     * Register column type handler.
     */
    OverviewTable.registerColumnTypeHandler('uuid', Text);

    //------------------------------------------------------------------------------------------------------------------
    return null;
  }
);

//----------------------------------------------------------------------------------------------------------------------
