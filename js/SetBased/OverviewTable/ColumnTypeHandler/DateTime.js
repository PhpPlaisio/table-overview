/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global define */

//----------------------------------------------------------------------------------------------------------------------
define(
  'SetBased/OverviewTable/ColumnTypeHandler/DateTime',

  ['jquery',
    'SetBased/OverviewTable',
    'SetBased/OverviewTable/ColumnTypeHandler/Text'],

  function ($, OverviewTable, Text) {
    "use strict";
    //------------------------------------------------------------------------------------------------------------------
    function DateTime() {
      // Use parent constructor.
      Text.call(this);
    }

    //------------------------------------------------------------------------------------------------------------------
    // Extend DateTime from Text.
    DateTime.prototype = Object.create(Text.prototype);
    // Set constructor for DateTime.
    DateTime.constructor = DateTime;

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Returns the numeric content of a table cell.
     *
     * @param {HTMLTableCellElement} table_cell The table cell.
     *
     * @returns {string}
     */
    DateTime.prototype.getSortKey = function (table_cell) {
      var classes;
      var class_names;
      var ret = '';
      var i;

      classes = $(table_cell).attr('class');
      if (classes) {
        // Split all the classes of @a $cell into an array.
        class_names = classes.split(/\s+/);

        // Look for a class that starts with 'data-'.
        for (i = 0; i < class_names.length; i = i + 1) {
          if (class_names[i].substr(0, 5) === "data-") {
            ret = decodeURIComponent(class_names[i].substr(5).replace(/\+/g, '%20'));
            break;
          }
        }
      }

      return ret;
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Register column type handlers.
     */
    OverviewTable.registerColumnTypeHandler('date', DateTime);
    OverviewTable.registerColumnTypeHandler('datetime', DateTime);

    //------------------------------------------------------------------------------------------------------------------
    return DateTime;
  }
);

//----------------------------------------------------------------------------------------------------------------------
