/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global define */

//----------------------------------------------------------------------------------------------------------------------
define(
  'SetBased/Abc/Table/ColumnTypeHandler/Uuid',

  ['SetBased/Abc/Table/OverviewTable',
    'SetBased/Abc/Table/ColumnTypeHandler/Text'],

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
