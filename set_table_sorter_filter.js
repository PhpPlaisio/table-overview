/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global window */
/*global $ */
/*global console */
/*global SET_NoneColumnTypeHandler */
/*global alert */

//----------------------------------------------------------------------------------------------------------------------
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
 *
 * @param text
 * @returns {string}
 */
function set_to_lower_case_no_accents(text) {
  "use strict";
  var char;
  var text_new = '';
  var i;

  for (i = 0; i < text.length; i = i + 1) {
    char = text.substr(i, 1);
    if (trans[char]) {
      text_new += trans[char];
    } else {
      text_new += char;
    }
  }
  return text_new.toLowerCase();
}

// ---------------------------------------------------------------------------------------------------------------------
/**
 *
 * @param $table
 * @constructor
 */
function SET_OverviewTable($table) {
  "use strict";
  var that = this;
  var i;

  /**
   * Set to true for debugging and performance improvement.
   * @type {boolean}
   */
  this.myDebug = true;

  this.$myTable = $table;

  // Display the row with table filters.
  $table.find('thead tr.filter').each(function () {
    $(this).css('display', 'table-row');
  });

  // Get the column types and install the column handlers.
  this.myColumnHandlers = [];
  var column_index = 0;
  $table.find('thead tr.header').find('th').each(function (header_index, th) {
    var attr;
    var classes;
    var span;

    that.myColumnHandlers[column_index] = null;

    attr = $(th).attr('class');
    classes = attr.split(' ');
    for (i = 0; i < classes.length; i = i + 1) {
      if (classes[i].substr(0, 10) === 'data-type-') {

        var column_type = classes[i].substr(10);
        if (SET_OverviewTable.ourColumnTypeHandlers[column_type]) {
          that.myColumnHandlers[column_index] = new SET_OverviewTable.ourColumnTypeHandlers[column_type]();
        }
      }
    }

    // If no handle for the column type can be found use SET_NoneColumnTypeHandler.
    if (!that.myColumnHandlers[column_index]) {
      that.myColumnHandlers[column_index] = new SET_NoneColumnTypeHandler();
    }

    // Initialize the filter.
    that.myColumnHandlers[column_index].initFilter(that, $table, header_index, column_index);

    // Initialize the filter.
    that.myColumnHandlers[column_index].initSort(that, $table, header_index, column_index);

    // Take the colspan into account for computing the next column_index.
    span = $(this).attr('colspan');
    if (span) {
      column_index = column_index + parseFloat(span);
    } else {
      column_index = column_index + 1;
    }
  });
}

// --------------------------------------------------------------------------------------------------------------------
/**
 * @param sort_info
 * @param column_sort_info
 * @returns {*}
 */
SET_OverviewTable.prototype.mergeInfo = function (sort_info, column_sort_info) {
  "use strict";
  if (sort_info.length === 0) {
    column_sort_info.sort_order = 1;
    sort_info[0] = column_sort_info;
  } else {
    // xxx remove holes from sort_info.

    if (column_sort_info.sort_order !== false && sort_info[column_sort_info.sort_order - 1]) {
      // xxx add comment
      sort_info[column_sort_info.sort_order - 1].sort_direction = column_sort_info.sort_direction;
    } else {
      // xxx add comment.
      column_sort_info.sort_order = sort_info.length;
      sort_info[sort_info.length] = column_sort_info;
    }
  }

  return sort_info;
};

// --------------------------------------------------------------------------------------------------------------------
/**
 *
 * @param event
 * @param $header
 * @param that
 * @param header_index
 * @param column_index
 */
SET_OverviewTable.prototype.sort = function (event, $header, that, header_index, column_index) {
  "use strict";
  var sort_info;
  var sort_column_info;

  sort_info = this.getSortInfo();
  sort_column_info = this.getColumnSortInfo(event, $header, header_index, column_index);

  // Remove all classes concerning sorting from the column headers.
  this.cleanSortClasses();
  if (!event.ctrlKey) {
    sort_info = this.mergeInfo([], sort_column_info);
    this.sortSingleColumn(sort_info[0], that);
  } else {
    sort_info = this.mergeInfo(sort_info, sort_column_info);
    if (sort_info.length === 1) {
      this.sortSingleColumn(sort_info[0], that);
    } else {
      this.sortMultiColumn(sort_info);
    }
  }

  // Add classes concerning sorting to the column headers.
  this.addSortInfo(sort_info);

  // Apply zebra theme for table.
  this.applyZebraTheme();
};

// --------------------------------------------------------------------------------------------------------------------
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
    $header = this.$myTable.children('thead').find('tr.header').find('th').eq(sort_info[i].header_index);

    if (sort_info[i].colspan === 1) {
      $header.addClass('sort-order-' + order);
    } else if (sort_info[i].colspan === 2) {
      if (sort_info[i].offset === 0) {
        $header.addClass('sort-order-1-' + order);

      } else if (sort_info[i].offset === 1) {
        $header.addClass('sort-order-2-' + order);
      }
    }
    $header.addClass('sorted-' + sort_info[i].sort_direction);
  }
};

// --------------------------------------------------------------------------------------------------------------------
/**
 * Get and return sort sort order for current column.
 *
 * @param $header
 * @param string
 * @returns {boolean}
 */
SET_OverviewTable.prototype.getSortOrder = function ($header, string) {
  "use strict";
  var attr;
  var classes;
  var i;
  var order = false;

  attr = $header.attr('class');
  classes = attr.split(' ');

  for (i = 0; i < classes.length; i = i + 1) {
    if (classes[i].substr(0, string.length) === string) {
      order = parseInt(classes[i].substr(string.length), 10);
    }
  }

  return order;
};


// --------------------------------------------------------------------------------------------------------------------
/**
 * Get and return sort direction for current column.
 *
 * @param $header
 * @returns {boolean}
 */
SET_OverviewTable.prototype.getSortDirection = function ($header) {
  "use strict";
  var sort_direction = false;

  if ($header.hasClass('sorted-desc')) {
    sort_direction = 'desc';
  } else {
    sort_direction = 'asc';
  }

  return sort_direction;
};


// --------------------------------------------------------------------------------------------------------------------
/**
 * Returns information about the columns on which the table is currently sorted.
 * Returns an array indexed by the sort order with objects holding sorting information of the column.
 */
SET_OverviewTable.prototype.getSortInfo = function () {
  "use strict";
  var column_index = 0;
  var columns_info = [];
  var span;
  var sort_order;
  var sort_direction;
  var that = this;
  var colspan;

  this.$myTable.find('thead tr.header').find('th').each(function (header_index, th) {
    var $th = $(th);
    span = $(this).attr('colspan');
    if (!span || span === '1') {
      sort_order = that.getSortOrder($th, 'sort-order-');
      if (sort_order) {
        columns_info[sort_order - 1] = {
          column_index: column_index,
          header_index: header_index,
          sort_order: sort_order,
          sort_direction: that.getSortDirection($th),
          infix: '-',
          colspan: 1,
          offset: 0
        };
      }
    } else if (span === '2') {
      if ($th.hasClass('sort-1')) {
        sort_order = that.getSortOrder($th, 'sort-order-1-');
        if (sort_order) {
          columns_info[sort_order - 1] = {
            column_index: column_index,
            header_index: header_index,
            sort_order: sort_order,
            sort_direction: that.getSortDirection($th),
            infix: '-1-',
            colspan: 2,
            offset: 0
          };
        }
      }

      if ($th.hasClass('sort-2')) {
        sort_order = that.getSortOrder($th, 'sort-order-2-');
        if (sort_order) {
          columns_info[sort_order - 1] = {
            column_index: column_index,
            header_index: header_index,
            sort_order: that.getSortDirection($th),
            sort_direction: sort_direction,
            infix: '-2-',
            colspan: 2,
            offset: 1
          };
        }
      }
    }

    // Take the colspan into account for computing the next column_index.
    if (span) {
      column_index = column_index + parseFloat(span);
    } else {
      column_index = column_index + 1;
    }
  });

  return columns_info;
};

// --------------------------------------------------------------------------------------------------------------------
/**
 * Add sort direction
 *
 * @param event
 * @param $header
 * @param header_index
 * @param column_index
 * @returns {{}}
 */
SET_OverviewTable.prototype.getColumnSortInfo = function (event, $header,  header_index, column_index) {
  "use strict";
  var span;
  var column_info = {};
  var width_col1;
  var width_col2;
  var width_header;
  var direction;
  var $table = this.$myTable;
  var diff;
  var x;

  column_info.column_index = column_index;
  column_info.header_index = header_index;

  direction = this.getSortDirection($header);

  if (direction === 'desc' || direction === false) {
    column_info.sort_direction = 'asc';
  } else {
    column_info.sort_direction = 'desc';
  }

  span = $header.attr('colspan');
  if (!span || span === '1') {
    column_info.sort_order = this.getSortOrder($header, 'sort-order-');
    column_info.infix = '-';
    column_info.colspan = 1;
    column_info.offset = 0;
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
        column_info.sort_order = this.getSortOrder($header, 'sort-order-1-');
        column_info.infix = '-1-';
        column_info.colspan = 2;
        column_info.offset = 0;
      } else if (x > ((2 * width_col1 + diff) / 2)) {
        column_info.sort_order = this.getSortOrder($header, 'sort-order-2-');
        column_info.infix = '-2-';
        column_info.colspan = 2;
        column_info.offset = 1;
      }
    } else if ($header.hasClass('sort-1')) {
      // Header spans two columns but only the first/left column can used for sorting.
      column_info.sort_order = this.getSortOrder($header, 'sort-order-1-');
      column_info.infix = '-1-';
      column_info.colspan = 2;
      column_info.offset = 0;
    } else if ($header.hasClass('sort-2')) {
      // Header spans two columns but only the second/right column can used for sorting.
      column_info.sort_order = this.getSortOrder($header, 'sort-order-2-');
      column_info.infix = '-2-';
      column_info.colspan = 2;
      column_info.offset = 1;
    }
  }
  // Colspan greater than 2 is not supported.

  return column_info;
};

// --------------------------------------------------------------------------------------------------------------------
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


// --------------------------------------------------------------------------------------------------------------------
// Debug part:
// put columns and direction on console.
//if (this.myDebug) {
//  time_start = new Date();
//}
//
//code
//
//if (this.myDebug) {
//  SET_OverviewTable.benchmark('Sort', time_start);
//  time_reappend = new Date();
//}


// If working okay, implement:
// sort one column => use sortSingleColumn
// sort 2 or more columns => sortMultiColumn
//   -- create dynamic sorting function.

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Apply zebra theme for table.
 */
SET_OverviewTable.prototype.applyZebraTheme = function () {
  "use strict";
  // Reapply zebra theme on visible rows.
  // Note: Using this.style.display is faster than using children('tr:visible').
  var even = true;

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
 * Sorts the table of this overview table.
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
    sort_direction = -1;
  } else {
    sort_direction = 1;
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

  // Actually sort the rows.
  rows.sort(function (row1, row2) {
    return sort_direction * column.compareSortKeys(row1, row2);
  });

  // Reappend the rows to the table body.
  tbody = this.$myTable.children('tbody')[0];
  for (i = 0; i < rows.length; i = i + 1) {
    rows[i].sortKey = null;
    tbody.appendChild(rows[i]);
  }
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Sorts the table by two or more columns.
 */
SET_OverviewTable.prototype.sortMultiColumn = function (sorting_info) {
  "use strict";
  var dir;
  var cmp;
  var $table = this.$myTable;
  var sort_direction;
  var i;
  var sort_func = '';

  // in sort_info column_index;
  // use this.myColumnHandlers[column_index]

  sort_func += "function () {\n";
  for (i = 0; i < sorting_info.length; i = i + 1) {
    if (i === sorting_info.length) {
      sort_func += "  return column[" + i + "].compareSortKeys(row1[" + i + "], row2[" + i + "]);\n";
    } else {
      sort_func += "  cmp = ($table.myColumnHandlers[" + i + "].compareSortKeys(row1[" + i + "], row2[" + i + "]);\n";
      sort_func += "  if (cmp!==0) {\n";
      sort_func += "    dir = 1;\n";
      sort_func += "    if (sorting_info[" + i + "].sort_direction === 'desc') {\n";
      sort_func += "      dir = -1;\n";
      sort_func += "    }\n";
      sort_func += "   return dir * cmp;\n";
      sort_func += "  }\n";
    }
  }
  sort_func += "}\n";

  // Get all the rows of the table.
  //rows = this.$myTable.children('tbody').children('tr').get();

  // Increment the column_index if the column header spans 2 columns.
  //column_index = sorting_info[0].column_index + sorting_info.offset;

  // xxx loop over sort_info
  // Pull out the sort keys of the table cells.
  //for (i = 0; i < rows.length; i = i + 1) {
  //  var cell = rows[i].cells[column_index];
  //  rows[i].sortKey[j] = column.getSortKey(cell);
  //}

  // Actually sort the rows.
  //rows.sort(eval(sort_func));

  // Reappend the rows to the table body.
  //tbody = this.$myTable.children('tbody')[0];
  //for (i = 0; i < rows.length; i = i + 1) {
  //  rows[i].sortKey = null;
  //  tbody.appendChild(rows[i]);

  //}
};


// ---------------------------------------------------------------------------------------------------------------------
SET_OverviewTable.ourColumnTypeHandlers = {};

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
//xxx improve zebra
SET_OverviewTable.prototype.filter = function () {
  "use strict";
  var filters = [];
  var row_index;
  var i;

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
    this.$myTable.children('tbody').children('tr:odd').removeClass('odd').addClass('even');
    this.$myTable.children('tbody').children('tr:even').removeClass('even').addClass('odd');
  } else {
    // One or more filters are effective.

    // Hide all rows.
    this.$myTable.children('tbody').children('tr').hide();

    // Apply all effective filters.
    row_index = 0;
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
        row_index = row_index + 1;
        if ((row_index % 2) === 1) {
          $this.removeClass('even').addClass('odd');
        } else {
          $this.removeClass('odd').addClass('even');
        }
      }
    });
  }
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Array with all registered SET overview tables.
 *
 * @type {{SET_OverviewTable}}
 */
SET_OverviewTable.ourTables = [];

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Registers forms that match the jQuery selector as a SET overview tables.
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
SET_OverviewTable.benchmark = function (s, d) {
  "use strict";
  SET_OverviewTable.log(s + (new Date().getTime() - d.getTime()) + "ms");
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
SET_NoneColumnTypeHandler.prototype.initSort = function (overview_table, $table, header_index, column_index) {
  "use strict";
  return false;
};

// ---------------------------------------------------------------------------------------------------------------------
SET_NoneColumnTypeHandler.prototype.initFilter = function (overview_table, $table, header_index, column_index) {
  "use strict";
  var $cell;

  $cell = $table.children('thead').find('tr.filter').find('td').eq(header_index);
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
  this.myFilterValue = this.$myInput.val();

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
SET_TextColumnTypeHandler.prototype.initSort = function (overview_table, $table, header_index, column_index) {
  "use strict";
  var that = this;
  var $header;

  // Install event handler for click on sort icon.
  $header = $table.children('thead').find('tr.header').find('th').eq(header_index);
  if ($header.hasClass('sort') || $header.hasClass('sort-1') || $header.hasClass('sort-2')) {
    $header.click(function (event) {
      overview_table.sort(event, $header, that, header_index, column_index);
    });
  }
};

// ---------------------------------------------------------------------------------------------------------------------
SET_TextColumnTypeHandler.prototype.initFilter = function (overview_table, $table, header_index, column_index) {
  "use strict";
  var that = this;

  this.$myInput = $table.children('thead').find('tr.filter').find('td').eq(header_index).find('input');

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
SET_TextColumnTypeHandler.prototype.compareSortKeys = function (row1, row2) {
  "use strict";
  if (row1.sortKey < row2.sortKey) {
    return -1;
  }
  if (row1.sortKey > row2.sortKey) {
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
 * @param {jquery} table_cell The table cell.
 *
 * @returns {Number}
 */
SET_NumericColumnTypeHandler.prototype.getSortKey = function (table_cell) {
  "use strict";
  var exp;

  exp = /[\d\.,\-\+]/g;

  return parseInt(exp.exec($(table_cell).text()).replace(',', '.'), 10);
};

// ---------------------------------------------------------------------------------------------------------------------
SET_NumericColumnTypeHandler.prototype.compareSortKeys = function (row1, row2) {
  "use strict";
  if (row1.sortKey === row2.sortKey) {
    return 0;
  }
  if (row1.sortKey === "" && !isNaN(row2.sortKey)) {
    return -1;
  }
  if (row2.sortKey === "" && !isNaN(row1.sortKey)) {
    return 1;
  }

  return row1.sortKey - row2.sortKey;
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Register column type handlers.
 */
SET_OverviewTable.registerColumnTypeHandler('numeric', SET_NumericColumnTypeHandler);

// ---------------------------------------------------------------------------------------------------------------------
