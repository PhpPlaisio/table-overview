/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global window */
/*global $ */
/*global SET_OverviewTable */
/*global set_to_lower_case_no_accents */

// ---------------------------------------------------------------------------------------------------------------------
function SET_TextColumnTypeHandler() {
  "use strict";
  this.$myInput = null;
  this.myFilterValue = null;

}

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Returns true if the row filter must take this column filter in to account. Returns false otherwise.
 *
 * @returns {boolean}
 */
SET_TextColumnTypeHandler.prototype.startFilter = function () {
  "use strict";
  this.myFilterValue = SET_OverviewTable.toLowerCaseNoAccents(this.$myInput.val());

  // Note: this.myFilterValue might be undefined in case there is no input:text box for filtering in the column header.

  return (this.myFilterValue !== undefined && this.myFilterValue !== '');
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Returns true if the table (based on this column filter) must be shown. Returns false otherwise.
 *
 * @param table_cell
 *
 * @returns {boolean}
 */
SET_TextColumnTypeHandler.prototype.simpleFilter = function (table_cell) {
  "use strict";
  var value;

  value = this.extractForFilter(table_cell);

  return (value.indexOf(this.myFilterValue) !== -1);
};

// ---------------------------------------------------------------------------------------------------------------------
SET_TextColumnTypeHandler.prototype.initSort = function (overview_table, column_index) {
  "use strict";
  var that = this;
  var $header;
  var x;
  var width_header;
  var width_col1;
  var width_col2;
  var diff;

  // Install event handler for click on sort icon.
  $header = overview_table.$myHeaders.eq(overview_table.myHeaderIndexLookup[column_index]);

  if ($header.hasClass('sort')) {
    $header.click(function (event) {
      overview_table.sort(event, $header, that, column_index);
    });
  } else if ($header.hasClass('sort-1') || $header.hasClass('sort-2')) {
    $header.click(function (event) {

      if ($header.hasClass('sort-1') && $header.hasClass('sort-2')) {

        x = event.pageX - $header.offset().left;

        if (overview_table.myHeaderIndexLookup[column_index] === overview_table.myHeaderIndexLookup[column_index - 1]) {
          width_col1 = overview_table.$myTable.find('tbody > tr:visible:first > td:eq(' + (column_index - 1) + ')').outerWidth();
          width_col2 = overview_table.$myTable.find('tbody > tr:visible:first > td:eq(' + column_index + ')').outerWidth();
        }

        if (overview_table.myHeaderIndexLookup[column_index] === overview_table.myHeaderIndexLookup[column_index + 1]) {
          width_col1 = overview_table.$myTable.find('tbody > tr:visible:first > td:eq(' + column_index + ')').outerWidth();
          width_col2 = overview_table.$myTable.find('tbody > tr:visible:first > td:eq(' + (column_index + 1) + ')').outerWidth();
        }

        width_header = $header.outerWidth();

        diff = width_header - width_col1 - width_col2;

        if (x > (width_col1 - diff / 2)) {
          if (overview_table.myHeaderIndexLookup[column_index] === overview_table.myHeaderIndexLookup[column_index - 1]) {
            // Sort by right column.
            overview_table.sort(event, $header, that, column_index);
          }
        } else if (x < (width_col1 + diff / 2)) {
          if (overview_table.myHeaderIndexLookup[column_index] === overview_table.myHeaderIndexLookup[column_index + 1]) {
            // Sort by left column.
            overview_table.sort(event, $header, that, column_index);
          }
        }
      } else if ($header.hasClass('sort-1')) {
        overview_table.sort(event, $header, that, column_index);
      } else if ($header.hasClass('sort-2')) {
        overview_table.sort(event, $header, that, column_index);
      }
    });
  }
};

// ---------------------------------------------------------------------------------------------------------------------
SET_TextColumnTypeHandler.prototype.initFilter = function (overview_table, column_index) {
  "use strict";
  var that = this;

  this.$myInput = overview_table.$myFilters.eq(column_index).find('input');

  // Clear the filter box (some browsers preserve the values on page reload).
  this.$myInput.val('');

  // Install event handler for ESC-key pressed in filter.
  this.$myInput.keyup(function (event) {
    // If the ESC-key was pressed or nothing is entered clear the value of the search box.
    if (event.keyCode === 27) {
      that.$myInput.val('');
    }
  });

  // Install event handler for changed filter value.
  this.$myInput.keyup({ table: overview_table, element: this.$myInput}, SET_OverviewTable.filterTrigger);


  // Resize the input box.
  this.$myInput.width(this.$myInput.closest('td').width() -
    parseInt(this.$myInput.css('margin-left'), 10) -
    parseInt(this.$myInput.css('border-left-width'), 10) -
    parseInt(this.$myInput.css('border-right-width'), 10) -
    parseInt(this.$myInput.css('margin-right'), 10));
  this.$myInput.css('visibility', 'visible');
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Returns the text content of a table_cell.
 *
 * @param table_cell
 *
 * @returns {string}
 */
SET_TextColumnTypeHandler.prototype.extractForFilter = function (table_cell) {
  "use strict";
  return SET_OverviewTable.toLowerCaseNoAccents($(table_cell).text());
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Returns the text content of a table cell.
 *
 * @param {jquery} table_cell The table cell.
 *
 * @returns {string}
 */
SET_TextColumnTypeHandler.prototype.getSortKey = function (table_cell) {
  "use strict";
  return SET_OverviewTable.toLowerCaseNoAccents($(table_cell).text());
};

// ---------------------------------------------------------------------------------------------------------------------
SET_TextColumnTypeHandler.prototype.compareSortKeys = function (value1, value2) {
  "use strict";
  if (value1 < value2) {
    return -1;
  }
  if (value1 > value2) {
    return 1;
  }

  return 0;
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Register column type handlers.
 */
SET_OverviewTable.registerColumnTypeHandler('text', SET_TextColumnTypeHandler);
SET_OverviewTable.registerColumnTypeHandler('email', SET_TextColumnTypeHandler);

