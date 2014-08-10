/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global window */
/*global $ */
/*global console */
/*global SET_NoneColumnTypeHandler */
/*global alert */

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

  if (SET_OverviewTable.ourDebug) {
    SET_OverviewTable.log('Start create OverviewTable:');
    SET_OverviewTable.myTimeStart = new Date();
    SET_OverviewTable.myTimeIntermidiate = new Date();
  }

  // The HTML table cells with filters of the HTML table.
  this.$myFilters = $table.children('thead').children('tr.filter').find('td');

  // The HTML headers of the HTML table.
  this.$myHeaders = $table.children('thead').children('tr.header').find('th');

  // Lookup from column index to header index.
  this.myHeaderIndexLookup = [];

  // The HTML table associated with the JavaScript object.
  this.$myTable = $table;

  // Display the row with table filters.
  $table.children('thead').children('tr.filter').each(function () {
    $(this).css('display', 'table-row');
  });
  SET_OverviewTable.benchmark('Prepare table and table info');

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
      that.myHeaderIndexLookup[that.myHeaderIndexLookup.length] = header_index;
    }
  });
  SET_OverviewTable.benchmark('Create lookup table from column_index to header_index');

  // Get the column types and install the column handlers.
  this.myColumnHandlers = [];
  $table.children('colgroup').children('col').each(function (column_index, col) {
    var attr;
    var classes;
    var column_type;

    that.myColumnHandlers[column_index] = null;

    attr = $(col).attr('class');
    if (attr) {
      classes = attr.split(' ');
      for (i = 0; i < classes.length; i = i + 1) {
        if (classes[i].substr(0, 10) === 'data-type-') {

          column_type = classes[i].substr(10);
          if (column_type === undefined || !SET_OverviewTable.ourColumnTypeHandlers[column_type]) {
            column_type = 'none';
          }
          break;
        }
      }
    } else {
      column_type = 'none';
    }

    that.myColumnHandlers[column_index] = new SET_OverviewTable.ourColumnTypeHandlers[column_type]();
    SET_OverviewTable.benchmark('Install column handler with type "' + column_type + '"');

    // Initialize the column handler.
    that.myColumnHandlers[column_index].initHandler(that, column_index);
    SET_OverviewTable.benchmark('Initialize column handler');

    // Initialize the filter.
    that.myColumnHandlers[column_index].initFilter(that, column_index);
    SET_OverviewTable.benchmark('Initialize filter');

    // Initialize the sorter.
    that.myColumnHandlers[column_index].initSort(that, column_index);
    SET_OverviewTable.benchmark('Initialize sorter');
  });

  // Execute additional initializations (if any)
  this.initHook();
  SET_OverviewTable.benchmark('Execute additional initializations');

  if (SET_OverviewTable.ourDebug) {
    SET_OverviewTable.log('End of create OverviewTable ' +
      (new Date().getTime() - SET_OverviewTable.myTimeIntermidiate.getTime()) +
      'ms');
  }
}

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Does nothing. However, can be overridden are replaced for additional initializations.
 */
SET_OverviewTable.prototype.initHook = function () {
  'use strict';
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Does nothing. However, can be overridden are replaced for additional actions after filtering.
 */
SET_OverviewTable.prototype.filterHook = function () {
  'use strict';
};

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
SET_OverviewTable.ourTables = {};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Map from column data type (i.e. class data-type-*) to column type handler.
 *
 * @type {{}}
 */
SET_OverviewTable.ourColumnTypeHandlers = {};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Object with parameters which names equals values what use for replace specific characters.
 */
SET_OverviewTable.ourCharacterMap = {
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
SET_OverviewTable.toLowerCaseNoAccents = function (text) {
  "use strict";
  var c;
  var text_new = '';
  var i;

  if (text === null || text === undefined) {
    return text;
  }

  for (i = 0; i < text.length; i = i + 1) {
    c = text.substr(i, 1);
    if (SET_OverviewTable.ourCharacterMap[c]) {
      text_new += SET_OverviewTable.ourCharacterMap[c];
    } else {
      text_new += c;
    }
  }
  return text_new.toLowerCase();
};

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
    if (column_sort_info.sort_order !== -1 && sort_info[column_sort_info.sort_order - 1]) {
      // If clicked column is already sorted and sort info contain info about this column,
      // change sort direction for it column.
      sort_info[column_sort_info.sort_order - 1].sort_direction = column_sort_info.sort_direction;
    } else {
      // If clicked column isn't sorted add this column info to sort info.
      column_sort_info.sort_order = sort_info.length + 1;
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
 * @returns {int}
 */
SET_OverviewTable.prototype.getSortOrder = function ($header, infix) {
  "use strict";
  var attr;
  var classes;
  var sort_order_class;
  var i;
  var order = -1;

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

  // Get info about all currently sorted columns.
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
    } else {
      this.sortMultiColumn(sort_info);
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
  var dual;

  this.$myTable.children('colgroup').children('col').each(function (column_index) {
    var $th = that.$myHeaders.eq(that.myHeaderIndexLookup[column_index]);

    span = $th.attr('colspan');
    if (!span || span === '1') {
      sort_order = that.getSortOrder($th, '-');
      if (sort_order !== -1) {
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
      if (!dual || dual === 'right') {
        dual = 'left';
      } else {
        dual = 'right';
      }

      if (dual === 'left' && $th.hasClass('sort-1')) {
        sort_order = that.getSortOrder($th, '-1-');
        if (sort_order !== -1) {
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

      if (dual === 'right' && $th.hasClass('sort-2')) {
        sort_order = that.getSortOrder($th, '-2-');
        if (sort_order !== -1) {
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

      if (this.myHeaderIndexLookup[column_index] === this.myHeaderIndexLookup[column_index - 1]) {
        // User clicked right column of a dual column header.
        width_col1 = this.$myTable.children('tbody').find('tr:visible:first > td:eq(' + (column_index - 1) + ')').
          outerWidth();
        width_col2 = this.$myTable.children('tbody').find('tr:visible:first > td:eq(' + column_index + ')').
          outerWidth();
      }

      if (this.myHeaderIndexLookup[column_index] === this.myHeaderIndexLookup[column_index + 1]) {
        // User clicked left column of a dual column header.
        width_col1 = this.$myTable.children('tbody').find('tr:visible:first > td:eq(' + column_index + ')').
          outerWidth();
        width_col2 = this.$myTable.children('tbody').find('tr:visible:first > td:eq(' + (column_index + 1) + ')').
          outerWidth();
      }

      width_header = $header.outerWidth();

      diff = width_header - width_col1 - width_col2;

      // We account diff due to cell separation.
      if (x < (width_col1 - diff / 2)) {
        column_info.infix = '-1-';
        column_info.colspan = 2;
        column_info.offset = 0;
        column_info.sort_order = this.getSortOrder($header, column_info.infix);
        column_info.sort_direction = getFlipSortDirection(this, $header, column_info.infix);
      } else if (x > (width_col1 + diff / 2)) {
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
    that.$myTable.children('thead').find('th').removeClass('sort-order-1-' + i);
    that.$myTable.children('thead').find('th').removeClass('sort-order-2-' + i);
  }

  // Remove the asc and desc sort classes from all headers.
  that.$myTable.children('thead').find('th').removeClass('sorted-asc').removeClass('sorted-desc');

  that.$myTable.children('thead').find('th').removeClass('sorted-1-asc').removeClass('sorted-1-desc');
  that.$myTable.children('thead').find('th').removeClass('sorted-2-asc').removeClass('sorted-2-desc');
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
    $header = this.$myHeaders.eq(this.myHeaderIndexLookup[sort_info[i].column_index]);
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

  // Get all the rows of the table.
  rows = this.$myTable.children('tbody').children('tr').get();

  // Pull out the sort keys of the table cells.
  for (i = 0; i < rows.length; i = i + 1) {
    var cell = rows[i].cells[sorting_info.column_index];
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
  var count;

  if (SET_OverviewTable.ourDebug) {
    SET_OverviewTable.log('Apply filters:');
    SET_OverviewTable.myTimeStart = new Date();
    SET_OverviewTable.myTimeIntermidiate = new Date();
  }

  // Create a list of effective filters.
  count = 0;
  for (i = 0; i < this.myColumnHandlers.length; i = i + 1) {
    if (this.myColumnHandlers[i] && this.myColumnHandlers[i].startFilter()) {
      filters[i] = this.myColumnHandlers[i];
      count += 1;
    } else {
      filters[i] = null;
    }
  }
  SET_OverviewTable.benchmark('Create a list of effective filters');


  if (count === 0) {
    if (SET_OverviewTable.ourDebug) {
      SET_OverviewTable.log('Filters list is empty.');
    }

    // All filters are ineffective. Show all rows.
    this.$myTable.children('tbody').children('tr').show();
    SET_OverviewTable.benchmark('Show all rows');

  } else {
    // One or more filters are effective.

    // Hide all rows.
    this.$myTable.children('tbody').children('tr').hide();
    SET_OverviewTable.benchmark('Hide all rows');

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
      }
    });
    SET_OverviewTable.benchmark('Apply all effective filters');
  }

  // Apply zebra theme on visible rows.
  that.applyZebraTheme();
  SET_OverviewTable.benchmark('Apply zebra theme');

  // Execute additional action after filtering.
  that.filterHook();
  SET_OverviewTable.benchmark('Execute additional action after filtering');


  if (SET_OverviewTable.ourDebug) {
    SET_OverviewTable.log('Finish, total time: ' +
      (new Date().getTime() - SET_OverviewTable.myTimeIntermidiate.getTime()) +
      ' ms');
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
 * @param selector  {string} The jQuery selector.
 * @param className {string} The class name.
 */
SET_OverviewTable.registerTable = function (selector, className) {
  "use strict";

  // Set name of class if this undefined.
  if (className === undefined) {
    className = 'SET_OverviewTable';
  }

  $(selector).each(function () {
    var $this = $(this);

    if ($this.is('table')) {
      // Selector is a table.
      if (!$this.hasClass('registered')) {
        SET_OverviewTable.ourTables[SET_OverviewTable.ourTables.length] = new window[className]($this);
        $this.addClass('registered');
      }
    } else {
      // Selector is not a table. Find the table below the selector.
      $this.find('table').first().each(function () {
        var $this = $(this);
        if (!$this.hasClass('registered')) {
          SET_OverviewTable.ourTables[SET_OverviewTable.ourTables.length] = new window[className]($this);
          $this.addClass('registered');
        }
      });
    }
  });
};
/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global window */
/*global $ */
/*global SET_OverviewTable */

// ---------------------------------------------------------------------------------------------------------------------
function SET_ColumnTypeHandler() {
  "use strict";
}

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Returns true if the row filter must take this column filter in to account. Returns false otherwise.
 *
 * @returns {boolean}
 */
SET_ColumnTypeHandler.prototype.startFilter = function () {
  "use strict";

  return false;
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Must be redefined if the column type handler needs special initialization.
 */
SET_ColumnTypeHandler.prototype.initHandler = function () {
  'use strict';
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Sets the appropriate classes of the column header and installs the appropriate event handlers on the column header of
 * the column of this column type handler.
 *
 * @param {SET_OverviewTable} overview_table  The overview table object of the table of the column of this column type
 *                                            handler.
 * @param {int}               column_index    The column index of the column of the table of the column of this column
 *                                            type handler.
 */
SET_ColumnTypeHandler.prototype.initSort = function (overview_table, column_index) {
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
          width_col1 = overview_table.$myTable.children('tbody').
            children('tr:visible:first').find('td:eq(' + (column_index - 1) + ')').outerWidth();
          width_col2 = overview_table.$myTable.children('tbody').
            children('tr:visible:first').find('td:eq(' + column_index + ')').outerWidth();
        }

        if (overview_table.myHeaderIndexLookup[column_index] === overview_table.myHeaderIndexLookup[column_index + 1]) {
          width_col1 = overview_table.$myTable.children('tbody').
            children('tr:visible:first').find('td:eq(' + column_index + ')').outerWidth();
          width_col2 = overview_table.$myTable.children('tbody').
            children('tr:visible:first').find('td:eq(' + (column_index + 1) + ')').outerWidth();
        }

        width_header = $header.outerWidth();

        diff = width_header - width_col1 - width_col2;

        if (x > (width_col1 - diff / 2)) {
          if (overview_table.myHeaderIndexLookup[column_index] ===
            overview_table.myHeaderIndexLookup[column_index - 1]) {
            // Sort by right column.
            overview_table.sort(event, $header, that, column_index);
          }
        } else if (x < (width_col1 + diff / 2)) {
          if (overview_table.myHeaderIndexLookup[column_index] ===
            overview_table.myHeaderIndexLookup[column_index + 1]) {
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
/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global window */
/*global $ */
/*global SET_ColumnTypeHandler */
/*global SET_OverviewTable */

// ---------------------------------------------------------------------------------------------------------------------
function SET_NoneColumnTypeHandler() {
  "use strict";

  // Use parent constructor.
  SET_ColumnTypeHandler.call(this);
}

// ---------------------------------------------------------------------------------------------------------------------
// Extend SET_NoneColumnTypeHandler from SET_ColumnTypeHandler.
SET_NoneColumnTypeHandler.prototype = Object.create(SET_ColumnTypeHandler.prototype);
// Set constructor for SET_NoneColumnTypeHandler.
SET_NoneColumnTypeHandler.constructor = SET_NoneColumnTypeHandler;

// ---------------------------------------------------------------------------------------------------------------------
SET_NoneColumnTypeHandler.prototype.initSort = function () {
  "use strict";
};

// ---------------------------------------------------------------------------------------------------------------------
SET_NoneColumnTypeHandler.prototype.initFilter = function () {
  "use strict";
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Register column type handler.
 */
SET_OverviewTable.registerColumnTypeHandler('none', SET_NoneColumnTypeHandler);

// ---------------------------------------------------------------------------------------------------------------------
/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global window */
/*global $ */
/*global SET_ColumnTypeHandler */
/*global SET_OverviewTable */

// ---------------------------------------------------------------------------------------------------------------------
function SET_TextColumnTypeHandler() {
  "use strict";
  // Use parent constructor.
  SET_ColumnTypeHandler.call(this);

  this.$myInput = null;
  this.myFilterValue = null;
}

// ---------------------------------------------------------------------------------------------------------------------
// Extend SET_TextColumnTypeHandler from SET_ColumnTypeHandler.
SET_TextColumnTypeHandler.prototype = Object.create(SET_ColumnTypeHandler.prototype);
// Set constructor for SET_TextColumnTypeHandler.
SET_TextColumnTypeHandler.constructor = SET_TextColumnTypeHandler;

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
  this.$myInput.width(this.$myInput.width() +
    (this.$myInput.closest('td').innerWidth() - this.$myInput.outerWidth(true)));
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Returns the text content of a table_cell.
 *
 * @param {HTMLTableElement} table_cell The table cell.
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
 * @param {HTMLTableCellElement} table_cell The table cell.
 *
 * @returns {string}
 */
SET_TextColumnTypeHandler.prototype.getSortKey = function (table_cell) {
  "use strict";
  return SET_OverviewTable.toLowerCaseNoAccents($(table_cell).text());
};


// ---------------------------------------------------------------------------------------------------------------------
/**
 * Compares two values of the column of this column type handler.
 *
 * @param {string} value1
 * @param {string} value2
 *
 * @returns {number}
 */
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
/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global window */
/*global $ */
/*global SET_TextColumnTypeHandler */
/*global SET_OverviewTable */

// ---------------------------------------------------------------------------------------------------------------------
function SET_DateTimeColumnTypeHandler() {
  "use strict";

  // Use parent constructor.
  SET_TextColumnTypeHandler.call(this);
}

// ---------------------------------------------------------------------------------------------------------------------
// Extend SET_DateTimeColumnTypeHandler from SET_TextColumnTypeHandler.
SET_DateTimeColumnTypeHandler.prototype = Object.create(SET_TextColumnTypeHandler.prototype);
// Set constructor for SET_DateTimeColumnTypeHandler.
SET_DateTimeColumnTypeHandler.constructor = SET_DateTimeColumnTypeHandler;

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Returns the numeric content of a table cell.
 *
 * @param {HTMLTableCellElement} table_cell The table cell.
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

  // Use parent constructor.
  SET_TextColumnTypeHandler.call(this);
}

// ---------------------------------------------------------------------------------------------------------------------
// Extend SET_NumericColumnTypeHandler from SET_TextColumnTypeHandler.
SET_NumericColumnTypeHandler.prototype = Object.create(SET_TextColumnTypeHandler.prototype);
// Set constructor for SET_NumericColumnTypeHandler.
SET_NumericColumnTypeHandler.constructor = SET_NumericColumnTypeHandler;

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Returns the numeric content of a table cell.
 *
 * @param {HTMLTableCellElement} table_cell The table cell.
 *
 * @returns {number}
 */
SET_NumericColumnTypeHandler.prototype.getSortKey = function (table_cell) {
  "use strict";
  var regexp;
  var parts;

  regexp = /[\d\.,\-\+]*/;
  parts = regexp.exec($(table_cell).text());

  // todo Better internationalisation.
  return parseInt(parts[0].replace('.', '').replace(',', '.'), 10);
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Compares two values of the column of this column type handler.
 *
 * @param {number} value1
 * @param {number} value2
 *
 * @returns {number}
 */
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
 * Register column type handler.
 */
SET_OverviewTable.registerColumnTypeHandler('numeric', SET_NumericColumnTypeHandler);

// ---------------------------------------------------------------------------------------------------------------------
