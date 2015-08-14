/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global define */

//----------------------------------------------------------------------------------------------------------------------
define(
  'SetBased/OverviewTablePackage',

  ['SetBased/OverviewTable',
    'SetBased/OverviewTable/ColumnTypeHandler/DateTime',
    'SetBased/OverviewTable/ColumnTypeHandler/Ipv4',
    'SetBased/OverviewTable/ColumnTypeHandler/None',
    'SetBased/OverviewTable/ColumnTypeHandler/Numeric',
    'SetBased/OverviewTable/ColumnTypeHandler/Text',
    'SetBased/OverviewTable/ColumnTypeHandler/Uuid'],

  function (OverviewTable) {
    "use strict";

    return OverviewTable;
  }
);

//----------------------------------------------------------------------------------------------------------------------
