/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global window */
/*global $ */
/*global SET_NoneColumnTypeHandler */

// ---------------------------------------------------------------------------------------------------------------------
function set_to_lower_case_no_accents(text) {
  "use strict";
  function remove_accent(char) {
    switch (char) {
    case 'à':
    case 'á':
    case 'â':
    case 'ã':
    case 'ä':
    case 'å':
      return 'a';
    case 'æ':
      return 'ae';
    case 'ç':
      return 'c';
    case 'è':
    case 'é':
    case 'ê':
    case 'ë':
    case 'ě':
    case 'ę':
      return 'e';
    case 'ð':
      return 'd';
    case 'ì':
    case 'í':
    case 'î':
    case 'ï':
      return 'i';
    case 'ł':
      return 'l';
    case 'ñ':
    case 'ń':
    case 'ň':
      return 'n';
    case 'ò':
    case 'ó':
    case 'ô':
    case 'õ':
    case 'ö':
    case 'ø':
      return 'o';
    case 'ù':
    case 'ú':
    case 'û':
    case 'ü':
      return 'u';
    case 'ş':
    case 'š':
      return 's';
    case 'ý':
    case 'ÿ':
      return 'y';
    case 'ž':
      return 'z';
    case 'þ':
      return 'th';
    case 'ß':
      return 'ss';
    default:
      return char;
    }
  }

  if (text) {
    return text.toLowerCase().replace(/./g, remove_accent);
  }

  return text;
}

// ---------------------------------------------------------------------------------------------------------------------
function SET_OverviewTable($table) {
  "use strict";
  var that = this;
  var i;

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

    // Take the colspan into account for computing the next column_index.
    span = $(this).attr('colspan');
    if (span) {
      column_index = column_index + parseFloat(span);
    } else {
      column_index = column_index + 1;
    }
  });
}

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

// --------------------------------------------------------------------------------------------------------------------
SET_OverviewTable.prototype.getSortInfo = function (event, $table, $header, column_index) {
  "use strict";
  var span;
  var ret = {};
  var width_col1;
  var width_col2;
  var width_header;
  var diff;
  var x;

  span = $header.attr('colspan');
  if (!span || span === '1') {
    ret.infix = '-';
    ret.colspan = 1;
    ret.offset = 0;
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
        ret.infix = '-1-';
        ret.colspan = 2;
        ret.offset = 0;
      } else if (x > ((2 * width_col1 + diff) / 2)) {
        ret.infix = '-2-';
        ret.colspan = 2;
        ret.offset = 1;
      }
    } else if ($header.hasClass('sort-1')) {
      // Header spans two columns but only the first/left column can used for sorting.
      ret.infix = '-1-';
      ret.colspan = 2;
      ret.offset = 0;
    } else if ($header.hasClass('sort-2')) {
      // Header spans two columns but only the second/right column can used for sorting.
      ret.infix = '-2-';
      ret.colspan = 2;
      ret.offset = 1;
    }
  }
  // Colspan greater than 2 is not supported.

  return ret;
};

// ---------------------------------------------------------------------------------------------------------------------
/**
 * Sorts the table of this overview table.
 *
 * @param event
 * @param $header
 * @param column
 * @param header_index
 * @param column_index
 */
SET_OverviewTable.prototype.sortSingleColumn = function (event, $header, column, header_index, column_index) {
  "use strict";
  var that = this;
  var info;
  var rows;
  var sort_direction;
  var $element;
  var i;

  info = this.getSortInfo(event, this.$myTable, $header, column_index);
  if (!info.infix) {
    // The use has clicked between two columns of a column header with colspan 2.
    // Don't sort and return immediately.
    return;
  }

  if (info.colspan === 1) {
    // The header spans 1 column.
    $element = $header;
  } else if (info.colspan === 2) {
    // The header spans 2 columns.
    if (info.offset === 0) {
      // Sort on the first/left column.
      $element = $header.children('span').first();
    } else if (info.offset === 1) {
      // Sort on the second/right column.
      $element = $header;
    }
  }

  // Get the sort direction.
  if ($element.hasClass('sorted-asc')) {
    sort_direction = -1;
  } else {
    sort_direction = 1;
  }

  // Increment the column_index if the column header spans 2 columns.
  column_index = column_index + info.offset;

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
  var tbody = this.$myTable.children('tbody')[0];
  for (i = 0; i < rows.length; i = i + 1) {
    rows[i].sortKey = null;
    tbody.appendChild(rows[i]);
  }

  // Remove the asc and desc sort classes from all headers.
  that.$myTable.children('thead').find('th').removeClass('sorted-asc').removeClass('sorted-desc');
  that.$myTable.children('thead').find('th > span').removeClass('sorted-asc').removeClass('sorted-desc');

  // Apply asc or desc sort class to the column on witch the table has been sorted.
  if (sort_direction === 1) {
    $element.addClass('sorted-asc');
  } else {
    $element.addClass('sorted-desc');
  }

  // Reapply zebra theme on visible rows.
  // Note: Using attr('display') is faster than using children('tr:visible').
  var index = 0;
  this.$myTable.children('tbody').children('tr').each(function () {
    var $this = $(this);

    if ($this.css('display') !== 'none') {
      if (((index + 1) % 2) === 1) {
        $this.removeClass('even').addClass('odd');
      } else {
        $this.removeClass('odd').addClass('even');
      }
      index = index + 1;
    }
  });
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
