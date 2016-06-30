/*jslint browser: true, vars: true, indent: 2, maxlen: 120 */
/*global alert */
/*global console */
/*global define */
/*global require */

//----------------------------------------------------------------------------------------------------------------------
define(
  'SetBased/Abc/Table/OverviewTable',

  ['jquery'],

  function ($) {
    'use strict';
    //------------------------------------------------------------------------------------------------------------------
    /**
     * Object constructor.
     *
     * @param $table
     * @constructor
     */
    function OverviewTable($table) {
      var that = this;
      var i;

      if (OverviewTable.ourDebug) {
        OverviewTable.log('Start create OverviewTable:');
        OverviewTable.myTimeStart = new Date();
        OverviewTable.myTimeIntermidiate = new Date();
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
      OverviewTable.benchmark('Prepare table and table info');

      // Column headers can span 1 or 2 columns. Create lookup table from column_index to header_index.
      this.$myHeaders.each(function (header_index, th) {
        var j;
        var span;

        span = $(th).attr('colspan');
        if (span) {
          span = parseFloat(span);
        } else {
          span = 1;
        }

        for (j = 0; j < span; j = j + 1) {
          that.myHeaderIndexLookup[that.myHeaderIndexLookup.length] = header_index;
        }
      });
      OverviewTable.benchmark('Create lookup table from column_index to header_index');

      // Get the column types and install the column handlers.
      this.myColumnHandlers = [];
      $table.children('colgroup').children('col').each(function (column_index, col) {
        var attr;
        var classes;
        var columnType;

        that.myColumnHandlers[column_index] = null;

        attr = $(col).attr('class');
        columnType = 'none';
        if (attr) {
          classes = attr.split(' ');
          for (i = 0; i < classes.length; i = i + 1) {
            if (classes[i].substr(0, 10) === 'data-type-') {

              columnType = classes[i].substr(10);
              if (columnType === undefined || !OverviewTable.ourColumnTypeHandlers[columnType]) {
                columnType = 'none';
              }
              break;
            }
          }
        }

        that.myColumnHandlers[column_index] = new OverviewTable.ourColumnTypeHandlers[columnType]();
        OverviewTable.benchmark('Install column handler with type "' + columnType + '"');

        // Initialize the column handler.
        that.myColumnHandlers[column_index].initHandler(that, column_index);
        OverviewTable.benchmark('Initialize column handler');

        // Initialize the filter.
        that.myColumnHandlers[column_index].initFilter(that, column_index);
        OverviewTable.benchmark('Initialize filter');

        // Initialize the sorter.
        that.myColumnHandlers[column_index].initSort(that, column_index);
        OverviewTable.benchmark('Initialize sorter');
      });

      // Execute additional initializations (if any)
      this.initHook();
      OverviewTable.benchmark('Execute additional initializations');

      if (OverviewTable.ourDebug) {
        OverviewTable.log('End of create OverviewTable ' +
          (new Date().getTime() - OverviewTable.myTimeIntermidiate.getTime()) +
          'ms');
      }
    }

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Does nothing. However, can be overridden are replaced for additional initializations.
     */
    OverviewTable.prototype.initHook = function () {
      return null;
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Does nothing. However, can be overridden are replaced for additional actions after filtering.
     */
    OverviewTable.prototype.filterHook = function () {
      return null;
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Set to true for debugging and performance improvement.
     * @type {boolean}
     */
    OverviewTable.ourDebug = false;

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Array with all registered SET overview tables.
     *
     * @type {{OverviewTable}}
     */
    OverviewTable.ourTables = {};

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Map from column data type (i.e. class data-type-*) to column type handler.
     *
     * @type {{}}
     */
    OverviewTable.ourColumnTypeHandlers = {};

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Object with parameters which names equals values what use for replace specific characters.
     */
    OverviewTable.ourCharacterMap = {
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

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Replace all specific character to standard character.
     * @param text
     * @returns {string}
     */
    OverviewTable.toLowerCaseNoAccents = function (text) {
      var c;
      var textNew = '';
      var i;

      if (text === null || text === undefined) {
        return text;
      }

      for (i = 0; i < text.length; i = i + 1) {
        c = text.substr(i, 1);
        if (OverviewTable.ourCharacterMap[c]) {
          textNew += OverviewTable.ourCharacterMap[c];
        } else {
          textNew += c;
        }
      }
      return textNew.toLowerCase();
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Enables profiling and debugging console messages.
     */
    OverviewTable.enableDebug = function () {
      OverviewTable.ourDebug = true;
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Merge info about columns.
     *
     * @param sortInfo
     * @param columnSortInfo
     * @returns {{}}
     */
    OverviewTable.prototype.mergeInfo = function (sortInfo, columnSortInfo) {
      if (sortInfo.length === 0) {
        // If selected only one column and sort info is empty, add column info
        columnSortInfo.sort_order = 1;
        sortInfo[0] = columnSortInfo;
      } else {
        if (columnSortInfo.sort_order !== -1 && sortInfo[columnSortInfo.sort_order - 1]) {
          // If clicked column is already sorted and sort info contain info about this column,
          // change sort direction for it column.
          sortInfo[columnSortInfo.sort_order - 1].sort_direction = columnSortInfo.sort_direction;
        } else {
          // If clicked column isn't sorted add this column info to sort info.
          columnSortInfo.sort_order = sortInfo.length + 1;
          sortInfo[sortInfo.length] = columnSortInfo;
        }
      }

      return sortInfo;
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Returns sort order for a column.
     *
     * @param $header
     * @param infix
     *
     * @returns {int}
     */
    OverviewTable.prototype.getSortOrder = function ($header, infix) {
      var attr;
      var classes;
      var sortOrderClass;
      var i;
      var order = -1;

      attr = $header.attr('class');
      if (attr) {
        classes = attr.split(' ');

        for (i = 0; i < classes.length; i = i + 1) {
          sortOrderClass = 'sort-order' + infix;
          if (classes[i].substr(0, sortOrderClass.length) === sortOrderClass) {
            order = parseInt(classes[i].substr(sortOrderClass.length), 10);
          }
        }
      }

      return order;
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Get and return sort direction for current column.
     *
     * @param $header
     * @param infix
     *
     * @returns {string}
     */
    OverviewTable.prototype.getSortDirection = function ($header, infix) {
      if ($header.hasClass('sorted' + infix + 'desc')) {
        return 'desc';
      }

      if ($header.hasClass('sorted' + infix + 'asc')) {
        return 'asc';
      }

      return '';
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     *
     * @param event
     * @param $header
     * @param column
     * @param columnIndex
     */
    OverviewTable.prototype.sort = function (event, $header, column, columnIndex) {
      var sortInfo;
      var sortColumnInfo;

      if (OverviewTable.ourDebug) {
        OverviewTable.log('Start sort:');
        OverviewTable.myTimeStart = new Date();
        OverviewTable.myTimeIntermidiate = new Date();
      }

      // Get info about all currently sorted columns.
      sortInfo = this.getSortInfo();
      OverviewTable.benchmark('Get all sort info');

      // Get info about column what was selected for sort.
      sortColumnInfo = this.getColumnSortInfo(event, $header, columnIndex);
      OverviewTable.benchmark('Get info about current column');

      // Remove all classes concerning sorting from the column headers.
      this.cleanSortClasses();
      OverviewTable.benchmark('Reset column headers');

      if (!event.ctrlKey) {
        sortInfo = this.mergeInfo([], sortColumnInfo);
        OverviewTable.benchmark('Merge info');
        this.sortSingleColumn(sortInfo[0], column);
      } else {
        sortInfo = this.mergeInfo(sortInfo, sortColumnInfo);
        OverviewTable.benchmark('Merge info');
        if (sortInfo.length === 1) {
          this.sortSingleColumn(sortInfo[0], column);
        } else {
          this.sortMultiColumn(sortInfo);
        }
      }

      // Add classes concerning sorting to the column headers.
      this.addSortInfo(sortInfo);
      OverviewTable.benchmark('Added info to table head');

      // Apply zebra theme for the table.
      this.applyZebraTheme();
      OverviewTable.benchmark('Apply zebra theme');

      if (OverviewTable.ourDebug) {
        OverviewTable.log('Finish sort ' +
          (new Date().getTime() - OverviewTable.myTimeIntermidiate.getTime()) +
          'ms');
      }
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Returns an array indexed by the sort order with objects holding sorting information of the column.
     */
    OverviewTable.prototype.getSortInfo = function () {
      var columnsInfo = [];
      var span;
      var sortOrder;
      var that = this;
      var colspan;
      var dual;

      this.$myTable.children('colgroup').children('col').each(function (columnIndex) {
        var $th = that.$myHeaders.eq(that.myHeaderIndexLookup[columnIndex]);

        span = $th.attr('colspan');
        if (!span || span === '1') {
          sortOrder = that.getSortOrder($th, '-');
          if (sortOrder !== -1) {
            columnsInfo[sortOrder - 1] = {
              column_index: columnIndex,
              sort_order: sortOrder,
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
            sortOrder = that.getSortOrder($th, '-1-');
            if (sortOrder !== -1) {
              columnsInfo[sortOrder - 1] = {
                column_index: columnIndex,
                sort_order: sortOrder,
                sort_direction: that.getSortDirection($th, '-1-'),
                infix: '-1-',
                colspan: 2,
                offset: 0
              };
            }
          }

          if (dual === 'right' && $th.hasClass('sort-2')) {
            sortOrder = that.getSortOrder($th, '-2-');
            if (sortOrder !== -1) {
              columnsInfo[sortOrder - 1] = {
                column_index: columnIndex,
                sort_order: sortOrder,
                sort_direction: that.getSortDirection($th, '-2-'),
                infix: '-2-',
                colspan: 2,
                offset: 1
              };
            }
          }
        }
      });

      return columnsInfo;
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Returns object with info for sorting of a column.
     *
     * @param event
     * @param $header
     * @param columnIndex
     *
     * @returns {{}}
     */
    OverviewTable.prototype.getColumnSortInfo = function (event, $header, columnIndex) {
      var span;
      var columnInfo = {};
      var widthCol1 = 0;
      var widthCol2 = 0;
      var widthHeader;
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

      columnInfo.column_index = columnIndex;

      span = $header.attr('colspan');
      if (!span || span === '1') {
        columnInfo.infix = '-';
        columnInfo.colspan = 1;
        columnInfo.offset = 0;
        columnInfo.sort_order = this.getSortOrder($header, columnInfo.infix);
        columnInfo.sort_direction = getFlipSortDirection(this, $header, columnInfo.infix);
      } else if (span === '2') {
        if ($header.hasClass('sort-1') && $header.hasClass('sort-2')) {
          // Header spans two columns and both columns can be used for sorting.
          x = event.pageX - $header.offset().left;

          if (this.myHeaderIndexLookup[columnIndex] === this.myHeaderIndexLookup[columnIndex - 1]) {
            // User clicked right column of a dual column header.
            widthCol1 = this.$myTable.children('tbody').find('tr:visible:first > td:eq(' + (columnIndex - 1) + ')').outerWidth();
            widthCol2 = this.$myTable.children('tbody').find('tr:visible:first > td:eq(' + columnIndex + ')').outerWidth();
          }

          if (this.myHeaderIndexLookup[columnIndex] === this.myHeaderIndexLookup[columnIndex + 1]) {
            // User clicked left column of a dual column header.
            widthCol1 = this.$myTable.children('tbody').find('tr:visible:first > td:eq(' + columnIndex + ')').outerWidth();
            widthCol2 = this.$myTable.children('tbody').find('tr:visible:first > td:eq(' + (columnIndex + 1) + ')').outerWidth();
          }

          widthHeader = $header.outerWidth();

          diff = widthHeader - widthCol1 - widthCol2;

          // We account diff due to cell separation.
          if (x < (widthCol1 - diff / 2)) {
            columnInfo.infix = '-1-';
            columnInfo.colspan = 2;
            columnInfo.offset = 0;
            columnInfo.sort_order = this.getSortOrder($header, columnInfo.infix);
            columnInfo.sort_direction = getFlipSortDirection(this, $header, columnInfo.infix);
          } else if (x > (widthCol1 + diff / 2)) {
            columnInfo.infix = '-2-';
            columnInfo.colspan = 2;
            columnInfo.offset = 1;
            columnInfo.sort_order = this.getSortOrder($header, columnInfo.infix);
            columnInfo.sort_direction = getFlipSortDirection(this, $header, columnInfo.infix);
          }
        } else if ($header.hasClass('sort-1')) {
          // Header spans two columns but only the first/left column can used for sorting.
          columnInfo.infix = '-1-';
          columnInfo.colspan = 2;
          columnInfo.offset = 0;
          columnInfo.sort_order = this.getSortOrder($header, columnInfo.infix);
          columnInfo.sort_direction = getFlipSortDirection(this, $header, columnInfo.infix);
        } else if ($header.hasClass('sort-2')) {
          // Header spans two columns but only the second/right column can used for sorting.
          columnInfo.infix = '-2-';
          columnInfo.colspan = 2;
          columnInfo.offset = 1;
          columnInfo.sort_order = this.getSortOrder($header, columnInfo.infix);
          columnInfo.sort_direction = getFlipSortDirection(this, $header, columnInfo.infix);
        }
      }
      // Colspan greater than 2 is not supported.

      return columnInfo;
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Removes all classes concerning sorting from the column headers.
     */
    OverviewTable.prototype.cleanSortClasses = function () {
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

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Adds classes concerning sorting to the column headers.
     *
     * @param sortInfo
     */
    OverviewTable.prototype.addSortInfo = function (sortInfo) {
      var order;
      var $header;
      var i;

      for (i = 0; i < sortInfo.length; i = i + 1) {
        order = i + 1;
        $header = this.$myHeaders.eq(this.myHeaderIndexLookup[sortInfo[i].column_index]);
        $header.addClass('sort-order' + sortInfo[i].infix + order);
        $header.addClass('sorted' + sortInfo[i].infix + sortInfo[i].sort_direction);
      }
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Applies zebra theme on the table.
     */
    OverviewTable.prototype.applyZebraTheme = function () {
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

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Sorts the table by one column.
     *
     * @param sortingInfo
     * @param column
     */
    OverviewTable.prototype.sortSingleColumn = function (sortingInfo, column) {
      var rows;
      var sort_direction;
      var i;
      var tbody;
      var cell;

      if (!sortingInfo.infix) {
        // The use has clicked between two columns of a column header with colspan 2.
        // Don't sort and return immediately.
        return;
      }

      // Get the sort direction.
      if (sortingInfo.sort_direction === 'asc') {
        sort_direction = 1;
      } else {
        sort_direction = -1;
      }

      // Get all the rows of the table.
      rows = this.$myTable.children('tbody').children('tr').get();

      // Pull out the sort keys of the table cells.
      for (i = 0; i < rows.length; i = i + 1) {
        cell = rows[i].cells[sortingInfo.column_index];
        rows[i].sortKey = column.getSortKey(cell);
      }
      OverviewTable.benchmark('Extracting sort keys');

      // Actually sort the rows.
      rows.sort(function (row1, row2) {
        return sort_direction * column.compareSortKeys(row1.sortKey, row2.sortKey);
      });
      OverviewTable.benchmark('Sorted by one column');

      // Reappend the rows to the table body.
      tbody = this.$myTable.children('tbody')[0];
      for (i = 0; i < rows.length; i = i + 1) {
        rows[i].sortKey = null;
        tbody.appendChild(rows[i]);
      }
      OverviewTable.benchmark('Reappend the sorted rows');
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Sorts the table by two or more columns.
     * @param sortingInfo
     */
    OverviewTable.prototype.sortMultiColumn = function (sortingInfo) {
      var dir;
      var i, j;
      var sort_func = '';
      var rows;
      var cell;
      var column_handler;
      var tbody;
      var multi_cmp = null;

      // Get all the rows of the table.
      rows = this.$myTable.children('tbody').children('tr').get();

      for (i = 0; i < rows.length; i = i + 1) {
        rows[i].sortKey = [];
        for (j = 0; j < sortingInfo.length; j = j + 1) {
          column_handler = this.myColumnHandlers[sortingInfo[j].column_index];

          // Pull out the sort keys of the table cells.
          cell = rows[i].cells[sortingInfo[j].column_index];
          rows[i].sortKey[j] = column_handler.getSortKey(cell);
        }
      }
      OverviewTable.benchmark('Extracting sort keys');

      sort_func += "multi_cmp = function (row1, row2) {\n";
      sort_func += "  var cmp;\n";
      for (i = 0; i < sortingInfo.length; i = i + 1) {
        dir = 1;
        if (sortingInfo[i].sort_direction === 'desc') {
          dir = -1;
        }
        sort_func += "  cmp = this1.myColumnHandlers[" +
          sortingInfo[i].column_index +
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
      OverviewTable.benchmark('Prepare multi sort function');

      // Actually sort the rows.
      rows.sort(multi_cmp);
      OverviewTable.benchmark('Sorted by ' + sortingInfo.length + ' columns');

      // Reappend the rows to the table body.
      tbody = this.$myTable.children('tbody')[0];
      for (i = 0; i < rows.length; i = i + 1) {
        rows[i].sortKey = null;
        tbody.appendChild(rows[i]);
      }
      OverviewTable.benchmark('Reappend the sorted rows');
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     *
     */
    OverviewTable.prototype.filter = function () {
      var filters = [];
      var i;
      var that = this;
      var count;

      if (OverviewTable.ourDebug) {
        OverviewTable.log('Apply filters:');
        OverviewTable.myTimeStart = new Date();
        OverviewTable.myTimeIntermidiate = new Date();
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
      OverviewTable.benchmark('Create a list of effective filters');


      if (count === 0) {
        if (OverviewTable.ourDebug) {
          OverviewTable.log('Filters list is empty.');
        }

        // All filters are ineffective. Show all rows.
        this.$myTable.children('tbody').children('tr').show();
        OverviewTable.benchmark('Show all rows');

      } else {
        // One or more filters are effective.

        // Hide all rows.
        this.$myTable.children('tbody').children('tr').hide();
        OverviewTable.benchmark('Hide all rows');

        // Apply all effective filters.
        this.$myTable.children('tbody').children('tr').each(function () {
          var j;
          var show = 1;
          var $this = $(this);

          for (j = 0; j < filters.length; j += 1) {
            if (filters[j] && !filters[j].simpleFilter(this.cells[j])) {
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
        OverviewTable.benchmark('Apply all effective filters');
      }

      // Apply zebra theme on visible rows.
      that.applyZebraTheme();
      OverviewTable.benchmark('Apply zebra theme');

      // Execute additional action after filtering.
      that.filterHook();
      OverviewTable.benchmark('Execute additional action after filtering');


      if (OverviewTable.ourDebug) {
        OverviewTable.log('Finish, total time: ' +
          (new Date().getTime() - OverviewTable.myTimeIntermidiate.getTime()) +
          ' ms');
      }
    };

    //------------------------------------------------------------------------------------------------------------------
    OverviewTable.registerColumnTypeHandler = function (columnType, handler) {
      OverviewTable.ourColumnTypeHandlers[columnType] = handler;
    };

    //------------------------------------------------------------------------------------------------------------------
    OverviewTable.filterTrigger = function (event) {
      event.data.table.filter(event, event.data.element);
    };

    //------------------------------------------------------------------------------------------------------------------
    OverviewTable.benchmark = function (message) {
      if (OverviewTable.ourDebug === true) {
        OverviewTable.log(message + ' ' + (new Date().getTime() - OverviewTable.myTimeStart.getTime()) + " ms");
        OverviewTable.myTimeStart = new Date();
      }
    };

    //------------------------------------------------------------------------------------------------------------------
    OverviewTable.log = function (s) {
      if (console !== "undefined" && console.debug !== "undefined") {
        console.log(s);
      } else {
        alert(s);
      }
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Registers tables that matches a jQuery selector as a OverviewTable.
     *
     * @param selector  {string} The jQuery selector.
     * @param className {string} The class name.
     */
    OverviewTable.registerTable = function (selector, className) {
      // Set name of class if this undefined.
      if (className === undefined) {
        className = 'SetBased/Abc/Table/OverviewTable';
      }

      $(selector).each(function () {
        var $this1 = $(this);

        if ($this1.is('table')) {
          // Selector is a table.
          if (!$this1.hasClass('registered')) {
            require([className],
              function (Constructor) {
                OverviewTable.ourTables[OverviewTable.ourTables.length] = new Constructor($this1);
              });
            $this1.addClass('registered');
          }
        } else {
          // Selector is not a table. Find the table below the selector.
          $this1.find('table').first().each(function () {
            var $this2 = $(this);
            if (!$this2.hasClass('registered')) {
              require([className],
                function (Constructor) {
                  OverviewTable.ourTables[OverviewTable.ourTables.length] = new Constructor($this2);
                });
              $this2.addClass('registered');
            }
          });
        }
      });
    };

    //------------------------------------------------------------------------------------------------------------------
    return OverviewTable;

    //------------------------------------------------------------------------------------------------------------------
  }
);

//----------------------------------------------------------------------------------------------------------------------
