/*global define */

//----------------------------------------------------------------------------------------------------------------------
define(
  'SetBased/Abc/Table/ColumnTypeHandler/Ipv4',

  ['SetBased/Abc/Table/OverviewTable',
    'SetBased/Abc/Table/ColumnTypeHandler/Text'],

  function (OverviewTable, Text) {
    'use strict';
    //------------------------------------------------------------------------------------------------------------------
    /**
     * Register column type handler.
     */
    OverviewTable.registerColumnTypeHandler('ipv4', Text);

    //------------------------------------------------------------------------------------------------------------------
    return null;
  }
);

//----------------------------------------------------------------------------------------------------------------------
