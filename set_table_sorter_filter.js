/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global window */
/*global $ */
/*global console */
/*global SET_NoneColumnTypeHandler */
/*global alert */


// ---------------------------------------------------------------------------------------------------------------------
/**
 * Object with parameters which names equals values what use for replace specific characters.
 */
var trans = {
  'à': 'a',
  'á': 'a',
  'â': 'a',
  'ã': 'a',
  'ä': 'a',
  'å': 'a',
  'æ': 'ae',
  'ç': 'c',
  'è': 'e',
  'é': 'e',
  'ê': 'e',
  'ë': 'e',
  'ě': 'e',
  'ę': 'e',
  'ð': 'd',
  'ì': 'i',
  'í': 'i',
  'î': 'i',
  'ï': 'i',
  'ł': 'l',
  'ñ': 'n',
  'ń': 'n',
  'ň': 'n',
  'ò': 'o',
  'ó': 'o',
  'ô': 'o',
  'õ': 'o',
  'ö': 'o',
  'ø': 'o',
  'ù': 'u',
  'ú': 'u',
  'û': 'u',
  'ü': 'u',
  'ş': 's',
  'š': 's',
  'ý': 'y',
  'ÿ': 'y',
  'ž': 'z',
  'þ': 'th',
  'ß': 'ss',
  'À': 'A',
  'Á': 'A',
  'Â': 'A',
  'Ã': 'A',
  'Ä': 'A',
  'Å': 'A',
  'Æ': 'AE',
  'Ç': 'C',
  'È': 'E',
  'É': 'E',
  'Ê': 'E',
  'Ë': 'E',
  'Ě': 'E',
  'Ę': 'E',
  'Ð': 'D',
  'Ì': 'I',
  'Í': 'I',
  'Î': 'I',
  'Ï': 'I',
  'Ł': 'L',
  'Ñ': 'N',
  'Ń': 'N',
  'Ň': 'N',
  'Ò': 'O',
  'Ó': 'O',
  'Ô': 'O',
  'Õ': 'O',
  'Ö': 'O',
  'Ø': 'O',
  'Ù': 'U',
  'Ú': 'U',
  'Û': 'U',
  'Ü': 'U',
  'Ş': 'S',
  'Š': 'S',
  'Ý': 'Y',
  'Ÿ': 'Y',
  'Ž': 'Z',
  'Þ': 'TH'
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Replace all specific character to standard character.
 * @param text
 * @returns {string}
 */
function set_to_lower_case_no_accents(text) {
  "use strict";
  var c;
  var text_new = '';
  var i;

  for (i = 0; i < text.length; i = i + 1) {
    c = text.substr(i, 1);
    if (trans[c]) {
      text_new += trans[c];
    } else {
      text_new += c;
    }
  }
  return text_new.toLowerCase();
}

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Object constructor.
 * 
 * @param $table
 * @constructor
 */
function SET_OverviewTable($table) {
  "use strict";
  var that = this;
  var i;

  // The HTML table cells with filters of the HTML table.
  this.$myFilters = $table.find('thead tr.filter').find('td');

  // The HTML headers of the HTML table.
  this.$myHeaders = $table.find('thead tr.header').find('th');

  // Lookup from column index to header index.
  this.myHeaderIndexLook = [];

  // The HTML table associated with the JavaScript object.
  this.$myTable = $table;

  // Display the row with table filters.
  $table.find('thead tr.filter').each(function () {
    $(this).css('display', 'table-row');
  });

  // Column headers can span 1 or 2 columns. Create lookup table from column_index to header_index.
  this.$myHeaders.each(function (header_index, th) {
    var i;
    var span;

    span = $(th).attr('colspan');
    if (span) {
      span = parseFloat(span);
    } else {
      span = 1;
    }

    for (i = 0; i < span; i = i + 1) {
      that.myHeaderIndexLook[that.myHeaderIndexLook.length] = header_index;
    }
  });

  // Get the column types and install the column handlers.
  this.myColumnHandlers = [];
  $table.find('colgroup').find('col').each(function (column_index, col) {
    var attr;
    var classes;

    that.myColumnHandlers[column_index] = null;

    attr = $(col).attr('class');
    if (attr) {
      classes = attr.split(' ');
      for (i = 0; i < classes.length; i = i + 1) {
        if (classes[i].substr(0, 10) === 'data-type-') {

          var column_type = classes[i].substr(10);
          if (SET_OverviewTable.ourColumnTypeHandlers[column_type]) {
            that.myColumnHandlers[column_index] = new SET_OverviewTable.ourColumnTypeHandlers[column_type]();
          }
        }
      }
    }

    // If no handler for the column type can be found use SET_NoneColumnTypeHandler.
    if (!that.myColumnHandlers[column_index]) {
      that.myColumnHandlers[column_index] = new SET_NoneColumnTypeHandler();
    }

    // Initialize the filter.
    that.myColumnHandlers[column_index].initFilter(that, column_index);

    // Initialize the sorter.
    that.myColumnHandlers[column_index].initSort(that, column_index);
  });
}

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Set to true for debugging and performance improvement.
 * @type {boolean}
 */
SET_OverviewTable.ourDebug = false;

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Array with all registered SET overview tables.
 *
 * @type {{SET_OverviewTable}}
 */
SET_OverviewTable.ourTables = [];

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Map from column data type (i.e. class data-type-*) to column type handler.
 * 
 * @type {{}}
 */
SET_OverviewTable.ourColumnTypeHandlers = {};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Enables profiling and debugging console messages.
 */
SET_OverviewTable.enableDebug = function () {
  "use strict";
  SET_OverviewTable.ourDebug = true;
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Merge info about columns.
 *
 * @param sort_info
 * @param column_sort_info
 * @returns {{}}
 */
SET_OverviewTable.prototype.mergeInfo = function (sort_info, column_sort_info) {
  "use strict";
  if (sort_info.length === 0) {
    // If selected only one column and sort info is empty, add column info
    column_sort_info.sort_order = 1;
    sort_info[0] = column_sort_info;
  } else {
    if (column_sort_info.sort_order !== false && sort_info[column_sort_info.sort_order - 1]) {
      // If clicked column is already sorted and sort info contain info about this column,
      // change sort direction for it column.
      sort_info[column_sort_info.sort_order - 1].sort_direction = column_sort_info.sort_direction;
    } else {
      // If clicked column isn't sorted add this column info to sort info.
      column_sort_info.sort_order = sort_info.length;
      sort_info[sort_info.length] = column_sort_info;
    }
  }

  return sort_info;
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Returns sort order for a column.
 *
 * @param $header
 * @param infix
 *
 * @returns {boolean}
 */
SET_OverviewTable.prototype.getSortOrder = function ($header, infix) {
  "use strict";
  var attr;
  var classes;
  var sort_order_class;
  var i;
  var order = false;

  attr = $header.attr('class');
  if (attr) {
    classes = attr.split(' ');

    for (i = 0; i < classes.length; i = i + 1) {
      sort_order_class = 'sort-order' + infix;
      if (classes[i].substr(0, sort_order_class.length) === sort_order_class) {
        order = parseInt(classes[i].substr(sort_order_class.length), 10);
      }
    }
  }

  return order;
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Get and return sort direction for current column.
 * @param $header
 * @param infix
 * @returns {string}
 *
 */
SET_OverviewTable.prototype.getSortDirection = function ($header, infix) {
  "use strict";

  if ($header.hasClass('sorted' + infix + 'desc')) {
    return 'desc';
  }

  if ($header.hasClass('sorted' + infix + 'asc')) {
    return 'asc';
  }
  return '';
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 *
 * @param event
 * @param $header
 * @param column
 * @param column_index
 */
SET_OverviewTable.prototype.sort = function (event, $header, column, column_index) {
  "use strict";
  var sort_info;
  var sort_column_info;

  if (SET_OverviewTable.ourDebug) {
    SET_OverviewTable.log('Start sort:');
    SET_OverviewTable.myTimeStart = new Date();
    SET_OverviewTable.myTimeIntermidiate = new Date();
  }

  // Get info about all  currently sorted columns.
  sort_info = this.getSortInfo();
  SET_OverviewTable.benchmark('Get all sort info');

  // Get info about column what was selected for sort.
  sort_column_info = this.getColumnSortInfo(event, $header, column_index);
  SET_OverviewTable.benchmark('Get info about current column');

  // Remove all classes concerning sorting from the column headers.
  this.cleanSortClasses();
  SET_OverviewTable.benchmark('Reset column headers');

  if (!event.ctrlKey) {
    sort_info = this.mergeInfo([], sort_column_info);
    SET_OverviewTable.benchmark('Merge info');
    this.sortSingleColumn(sort_info[0], column);
  } else {
    sort_info = this.mergeInfo(sort_info, sort_column_info);
    SET_OverviewTable.benchmark('Merge info');
    if (sort_info.length === 1) {
      this.sortSingleColumn(sort_info[0], column);
      SET_OverviewTable.benchmark('Sorted by one column');
    } else {
      this.sortMultiColumn(sort_info);
      SET_OverviewTable.benchmark('Sorted by ' + sort_info.length + ' column');
    }
  }

  // Add classes concerning sorting to the column headers.
  this.addSortInfo(sort_info);
  SET_OverviewTable.benchmark('Added info to table head');

  // Apply zebra theme for the table.
  this.applyZebraTheme();
  SET_OverviewTable.benchmark('Apply zebra theme');

  if (SET_OverviewTable.ourDebug) {
    SET_OverviewTable.log('Finish sort ' +
      (new Date().getTime() - SET_OverviewTable.myTimeIntermidiate.getTime()) +
      'ms');
  }
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Returns an array indexed by the sort order with objects holding sorting information of the column.
 */
SET_OverviewTable.prototype.getSortInfo = function () {
  "use strict";
  var columns_info = [];
  var span;
  var sort_order;
  var sort_direction;
  var that = this;
  var colspan;

  this.$myTable.find('colgroup').find('col').each(function (column_index) {
    var $th = that.$myHeaders.eq(that.myHeaderIndexLook[column_index]);

    span = $th.attr('colspan');
    if (!span || span === '1') {
      sort_order = that.getSortOrder($th, '-');
      if (sort_order) {
        columns_info[sort_order - 1] = {
          column_index: column_index,
          sort_order: sort_order,
          sort_direction: that.getSortDirection($th, '-'),
          infix: '-',
          colspan: 1,
          offset: 0
        };
      }
    } else if (span === '2') {
      if ($th.hasClass('sort-1')) {
        sort_order = that.getSortOrder($th, '-1-');
        if (sort_order) {
          columns_info[sort_order - 1] = {
            column_index: column_index,
            sort_order: sort_order,
            sort_direction: that.getSortDirection($th, '-1-'),
            infix: '-1-',
            colspan: 2,
            offset: 0
          };
        }
      }

      if ($th.hasClass('sort-2')) {
        sort_order = that.getSortOrder($th, '-2-');
        if (sort_order) {
          columns_info[sort_order - 1] = {
            column_index: column_index,
            sort_order: that.getSortDirection($th, '-2-'),
            sort_direction: sort_direction,
            infix: '-2-',
            colspan: 2,
            offset: 1
          };
        }
      }
    }
  });

  return columns_info;
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Returns object with info for sorting of a column.
 *
 * @param event
 * @param $header
 * @param column_index
 * @returns {{}}
 */
SET_OverviewTable.prototype.getColumnSortInfo = function (event, $header, column_index) {
  "use strict";
  var span;
  var column_info = {};
  var width_col1;
  var width_col2;
  var width_header;
  var $table = this.$myTable;
  var diff;
  var x;

  function getFlipSortDirection($table, $header, infix) {
    var sort_direction;

    sort_direction = $table.getSortDirection($header, infix);
    if (sort_direction === 'desc' || sort_direction === '') {
      return 'asc';
    }

    return 'desc';
  }

  column_info.column_index = column_index;

  span = $header.attr('colspan');
  if (!span || span === '1') {
    column_info.infix = '-';
    column_info.colspan = 1;
    column_info.offset = 0;
    column_info.sort_order = this.getSortOrder($header, column_info.infix);
    column_info.sort_direction = getFlipSortDirection(this, $header, column_info.infix);
  } else if (span === '2') {
    if ($header.hasClass('sort-1') && $header.hasClass('sort-2')) {
      // Header spans two columns and both columns can be used for sorting.
      x = event.pageX - $header.offset().left;

      width_col1 = $table.find('tbody > tr:visible:first > td:eq(' + column_index + ')').outerWidth();
      width_col2 = $table.find('tbody > tr:visible:first > td:eq(' + (column_index + 1) + ')').outerWidth();
      width_header = $header.outerWidth();

      diff = width_header - width_col1 - width_col2;

      // We account diff due to cell separation.
      if (x < ((2 * width_col1 - diff) / 2)) {
        column_info.infix = '-1-';
        column_info.colspan = 2;
        column_info.offset = 0;
        column_info.sort_order = this.getSortOrder($header, column_info.infix);
        column_info.sort_direction = getFlipSortDirection(this, $header, column_info.infix);
      } else if (x > ((2 * width_col1 + diff) / 2)) {
        column_info.infix = '-2-';
        column_info.colspan = 2;
        column_info.offset = 1;
        column_info.sort_order = this.getSortOrder($header, column_info.infix);
        column_info.sort_direction = getFlipSortDirection(this, $header, column_info.infix);
      }
    } else if ($header.hasClass('sort-1')) {
      // Header spans two columns but only the first/left column can used for sorting.
      column_info.infix = '-1-';
      column_info.colspan = 2;
      column_info.offset = 0;
      column_info.sort_order = this.getSortOrder($header, column_info.infix);
      column_info.sort_direction = getFlipSortDirection(this, $header, column_info.infix);
    } else if ($header.hasClass('sort-2')) {
      // Header spans two columns but only the second/right column can used for sorting.
      column_info.infix = '-2-';
      column_info.colspan = 2;
      column_info.offset = 1;
      column_info.sort_order = this.getSortOrder($header, column_info.infix);
      column_info.sort_direction = getFlipSortDirection(this, $header, column_info.infix);
    }
  }
  // Colspan greater than 2 is not supported.

  return column_info;
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Remove all classes concerning sorting from the column headers.
 */
SET_OverviewTable.prototype.cleanSortClasses = function () {
  "use strict";
  var that = this;
  var i;
  // Remove all orders for all columns.
  for (i = 0; i < that.myColumnHandlers.length; i = i + 1) {
    that.$myTable.children('thead').find('th').removeClass('sort-order-' + i);
  }

  // Remove the asc and desc sort classes from all headers.
  that.$myTable.children('thead').find('th').removeClass('sorted-asc').removeClass('sorted-desc');
  that.$myTable.children('thead').find('th > span').removeClass('sorted-asc').removeClass('sorted-desc');
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Add classes concerning sorting to the column headers.
 *
 * @param sort_info
 */
SET_OverviewTable.prototype.addSortInfo = function (sort_info) {
  "use strict";
  var order;
  var $header;
  var i;

  for (i = 0; i < sort_info.length; i = i + 1) {
    order = i + 1;
    $header = this.$myHeaders.eq(this.myHeaderIndexLook[sort_info[i].column_index]);
    $header.addClass('sort-order' + sort_info[i].infix + order);
    $header.addClass('sorted' + sort_info[i].infix + sort_info[i].sort_direction);
  }
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Applies zebra theme on the table.
 */
SET_OverviewTable.prototype.applyZebraTheme = function () {
  "use strict";
  var even = true;

  // Note: Using this.style.display is faster than using children('tr:visible').
  this.$myTable.children('tbody').children('tr').each(function () {
    var $this = $(this);

    if (this.style.display !== 'none') {
      if (even === true) {
        $this.removeClass('odd').addClass('even');
      } else {
        $this.removeClass('even').addClass('odd');
      }
      even = !even;
    }
  });
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Sorts the table by one column.
 *
 * @param sorting_info
 * @param column
 */
SET_OverviewTable.prototype.sortSingleColumn = function (sorting_info, column) {
  "use strict";
  var column_index;
  var rows;
  var sort_direction;
  var i;
  var tbody;

  if (!sorting_info.infix) {
    // The use has clicked between two columns of a column header with colspan 2.
    // Don't sort and return immediately.
    return;
  }

  // Get the sort direction.
  if (sorting_info.sort_direction === 'asc') {
    sort_direction = 1;
  } else {
    sort_direction = -1;
  }

  // Increment the column_index if the column header spans 2 columns.
  column_index = sorting_info.column_index + sorting_info.offset;

  // Get all the rows of the table.
  rows = this.$myTable.children('tbody').children('tr').get();

  // Pull out the sort keys of the table cells.
  for (i = 0; i < rows.length; i = i + 1) {
    var cell = rows[i].cells[column_index];
    rows[i].sortKey = column.getSortKey(cell);
  }
  SET_OverviewTable.benchmark('Extracting sort keys');

  // Actually sort the rows.
  rows.sort(function (row1, row2) {
    return sort_direction * column.compareSortKeys(row1.sortKey, row2.sortKey);
  });
  SET_OverviewTable.benchmark('Sorted by one column');

  // Reappend the rows to the table body.
  tbody = this.$myTable.children('tbody')[0];
  for (i = 0; i < rows.length; i = i + 1) {
    rows[i].sortKey = null;
    tbody.appendChild(rows[i]);
  }
  SET_OverviewTable.benchmark('Reappend the sorted rows');
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Sorts the table by two or more columns.
 * @param sorting_info
 */
SET_OverviewTable.prototype.sortMultiColumn = function (sorting_info) {
  "use strict";
  var dir;
  var cmp;
  var i, j;
  var sort_func = '';
  var rows;
  var cell;
  var column_handler;
  var tbody;
  var that = this;
  var multi_cmp = null;


  // Get all the rows of the table.
  rows = this.$myTable.children('tbody').children('tr').get();

  for (i = 0; i < rows.length; i = i + 1) {
    rows[i].sortKey = [];
    for (j = 0; j < sorting_info.length; j = j + 1) {
      column_handler = this.myColumnHandlers[sorting_info[j].column_index];

      // Pull out the sort keys of the table cells.
      cell = rows[i].cells[sorting_info[j].column_index];
      rows[i].sortKey[j] = column_handler.getSortKey(cell);
    }
  }
  SET_OverviewTable.benchmark('Extracting sort keys');

  sort_func += "multi_cmp = function (row1, row2) {\n";
  sort_func += "  var cmp;\n";
  for (i = 0; i < sorting_info.length; i = i + 1) {
    dir = 1;
    if (sorting_info[i].sort_direction === 'desc') {
      dir = -1;
    }
    sort_func += "  cmp = that.myColumnHandlers[" +
      sorting_info[i].column_index +
      "].compareSortKeys(row1.sortKey[" +
      i + "], row2.sortKey[" +
      i + "]);\n";
    sort_func += "  if (cmp !== 0) {\n";
    sort_func += "    return cmp * " + dir + ";\n";
    sort_func += "  }\n";
  }
  sort_func += "  return 0;\n";
  sort_func += "};\n";
  eval(sort_func);
  SET_OverviewTable.benchmark('Prepare multi sort function');

  // Actually sort the rows.
  rows.sort(multi_cmp);
  SET_OverviewTable.benchmark('Sorted by ' + sorting_info.length + ' columns');

  // Reappend the rows to the table body.
  tbody = this.$myTable.children('tbody')[0];
  for (i = 0; i < rows.length; i = i + 1) {
    rows[i].sortKey = null;
    tbody.appendChild(rows[i]);
  }
  SET_OverviewTable.benchmark('Reappend the sorted rows');
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 *
 */
SET_OverviewTable.prototype.filter = function () {
  "use strict";
  var filters = [];
  var i;
  var that = this;

  // Create a list of effective filters.
  for (i = 0; i < this.myColumnHandlers.length; i = i + 1) {
    if (this.myColumnHandlers[i] && this.myColumnHandlers[i].startFilter()) {
      filters[i] = this.myColumnHandlers[i];
    } else {
      filters[i] = null;
    }
  }

  if (filters.length === 0) {
    // All filters are ineffective. Show all rows.
    this.$myTable.children('tbody').children('tr').show();

    // Apply zebra theme on all rows.
    that.applyZebraTheme();
  } else {
    // One or more filters are effective.

    // Hide all rows.
    this.$myTable.children('tbody').children('tr').hide();

    // Apply all effective filters.
    this.$myTable.children('tbody').children('tr').each(function () {
      var i;
      var show = 1;
      var $this = $(this);

      for (i = 0; i < filters.length; i += 1) {
        if (filters[i] && !filters[i].simpleFilter(this.cells[i])) {
          // The table cell does not match the filter. Don't show the row.
          show = 0;
          // There is no need to apply other filters on this row.
          break;
        }
      }

      if (show === 1) {
        // The row matches all filters. Show the row.
        $this.show();

        // Apply zebra theme on visible rows.
        that.applyZebraTheme();
      }
    });
  }
};

// ---------------------------------------------------------------------------------------------------------------------
SET_OverviewTable.registerColumnTypeHandler = function (column_type, handler) {
  "use strict";
  SET_OverviewTable.ourColumnTypeHandlers[column_type] = handler;
};

// ---------------------------------------------------------------------------------------------------------------------
SET_OverviewTable.filterTrigger = function (event) {
  "use strict";
  event.data.table.filter(event, event.data.element);
};

// ---------------------------------------------------------------------------------------------------------------------
SET_OverviewTable.benchmark = function (message) {
  "use strict";
  if (SET_OverviewTable.ourDebug === true) {
    SET_OverviewTable.log(message + ' ' + (new Date().getTime() - SET_OverviewTable.myTimeStart.getTime()) + " ms");
    SET_OverviewTable.myTimeStart = new Date();
  }
};

// ---------------------------------------------------------------------------------------------------------------------
SET_OverviewTable.log = function (s) {
  "use strict";
  if (console !== "undefined" && console.debug !== "undefined") {
    console.log(s);
  } else {
    alert(s);
  }
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Registers tables that matches a jQuery selector as a SET_OverviewTable.
 *
 * @param selector {string} The jQuery selector.
 */
SET_OverviewTable.registerTable = function (selector) {
  "use strict";
  $(selector).each(function () {
    var $this = $(this);

    if ($this.is('table')) {
      // Selector is a table.
      SET_OverviewTable.ourTables[SET_OverviewTable.ourTables.length] = new SET_OverviewTable($this);
    } else {
      // Selector is not a table. Find tables below the selector.
      $this.find('table').each(function () {
        SET_OverviewTable.ourTables[SET_OverviewTable.ourTables.length] = new SET_OverviewTable($(this));
      });
    }
  });
};

// ---------------------------------------------------------------------------------------------------------------------
/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global window */
/*global $ */
/*global SET_OverviewTable */

// ---------------------------------------------------------------------------------------------------------------------
function SET_NoneColumnTypeHandler() {
  "use strict";
}

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Returns false
 *
 * @returns {boolean}
 */
SET_NoneColumnTypeHandler.prototype.startFilter = function () {
  "use strict";
  return false;
};

// ---------------------------------------------------------------------------------------------------------------------
SET_NoneColumnTypeHandler.prototype.initSort = function (overview_table, column_index) {
  "use strict";
  return false;
};

// ---------------------------------------------------------------------------------------------------------------------
SET_NoneColumnTypeHandler.prototype.initFilter = function (overview_table, column_index) {
  "use strict";
  var $cell;

  $cell = overview_table.$myFilters.eq(column_index);
  $cell.html('');
  $cell.width($cell.css('width'));
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Register column type handlers.
 */
SET_OverviewTable.registerColumnTypeHandler('none', SET_NoneColumnTypeHandler);

// ---------------------------------------------------------------------------------------------------------------------
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
  this.myFilterValue = set_to_lower_case_no_accents(this.$myInput.val());

  return (this.myFilterValue !== '');
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

  // Install event handler for click on sort icon.
  $header = overview_table.$myHeaders.eq(overview_table.myHeaderIndexLook[column_index]);
  if ($header.hasClass('sort') || $header.hasClass('sort-1') || $header.hasClass('sort-2')) {
    $header.click(function (event) {
      overview_table.sort(event, $header, that, column_index);
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
  return set_to_lower_case_no_accents($(table_cell).text());
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
  return set_to_lower_case_no_accents($(table_cell).text());
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

// ---------------------------------------------------------------------------------------------------------------------
/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global window */
/*global $ */
/*global SET_TextColumnTypeHandler */
/*global SET_OverviewTable */

// ---------------------------------------------------------------------------------------------------------------------
function SET_DateTimeColumnTypeHandler() {
  "use strict";
}

// ---------------------------------------------------------------------------------------------------------------------
SET_DateTimeColumnTypeHandler.prototype = Object.create(SET_TextColumnTypeHandler.prototype);
SET_DateTimeColumnTypeHandler.constructor = SET_DateTimeColumnTypeHandler;

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Returns the numeric content of a table cell.
 *
 * @param {object} table_cell The table cell.
 *
 * @returns {string}
 */
SET_DateTimeColumnTypeHandler.prototype.getSortKey = function (table_cell) {
  "use strict";
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

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Register column type handlers.
 */
SET_OverviewTable.registerColumnTypeHandler('date', SET_DateTimeColumnTypeHandler);
SET_OverviewTable.registerColumnTypeHandler('datetime', SET_DateTimeColumnTypeHandler);

// ---------------------------------------------------------------------------------------------------------------------
/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global window */
/*global $ */
/*global SET_TextColumnTypeHandler */
/*global SET_OverviewTable */

// ---------------------------------------------------------------------------------------------------------------------
function SET_NumericColumnTypeHandler() {
  "use strict";
}

// ---------------------------------------------------------------------------------------------------------------------
SET_NumericColumnTypeHandler.prototype = Object.create(SET_TextColumnTypeHandler.prototype);
SET_NumericColumnTypeHandler.constructor = SET_NumericColumnTypeHandler;

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Returns the numeric content of a table cell.
 *
 * @param {object} table_cell The table cell.
 *
 * @returns {Number}
 */
SET_NumericColumnTypeHandler.prototype.getSortKey = function (table_cell) {
  "use strict";
  var regexp;
  var parts;

  regexp = /[\d\.,\-\+]*/;
  parts = regexp.exec($(table_cell).text());

  return parseInt(parts[0].replace(',', '.'), 10);
};

// ---------------------------------------------------------------------------------------------------------------------
SET_NumericColumnTypeHandler.prototype.compareSortKeys = function (value1, value2) {
  "use strict";
  if (value1 === value2) {
    return 0;
  }
  if (value1 === "" && !isNaN(value2)) {
    return -1;
  }
  if (value2 === "" && !isNaN(value1)) {
    return 1;
  }

  return value1 - value2;
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Register column type handlers.
 */
SET_OverviewTable.registerColumnTypeHandler('numeric', SET_NumericColumnTypeHandler);

// ---------------------------------------------------------------------------------------------------------------------
