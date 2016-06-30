/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global define */

//----------------------------------------------------------------------------------------------------------------------
define(
  'SetBased/Abc/Table/OverviewTablePackage',

  ['SetBased/Abc/Table/OverviewTable',
    'SetBased/Abc/Table/ColumnTypeHandler/Bool',
    'SetBased/Abc/Table/ColumnTypeHandler/DateTime',
    'SetBased/Abc/Table/ColumnTypeHandler/Ipv4',
    'SetBased/Abc/Table/ColumnTypeHandler/None',
    'SetBased/Abc/Table/ColumnTypeHandler/Numeric',
    'SetBased/Abc/Table/ColumnTypeHandler/Text',
    'SetBased/Abc/Table/ColumnTypeHandler/Uuid'],

  function (OverviewTable) {
    "use strict";

    return OverviewTable;
  }
);

//----------------------------------------------------------------------------------------------------------------------
