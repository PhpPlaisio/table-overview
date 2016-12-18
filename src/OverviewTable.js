/*jshint evil: true */
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
     * @param {jQuery} $table The table.
     *
     * @constructor
     */
    function OverviewTable($table) {
      var that = this;

      if (OverviewTable.debug) {
        OverviewTable.log('Start create OverviewTable:');
        OverviewTable.timeStart = new Date();
        OverviewTable.timeIntermidiate = new Date();
      }

      // The HTML table cells with filters of the HTML table.
      this.$filters = $table.children('thead').children('tr.filter').find('td');

      // The HTML headers of the HTML table.
      this.$headers = $table.children('thead').children('tr.header').find('th');

      // Lookup from column index to header index.
      this.headerIndexLookup = [];

      // The HTML table associated with the JavaScript object.
      this.$table = $table;

      // Display the row with table filters.
      $table.children('thead').children('tr.filter').each(function () {
        $(this).css('display', 'table-row');
      });
      OverviewTable.benchmark('Prepare table and table info');

      // Column headers can span 1 or 2 columns. Create lookup table from columnIndex to header_index.
      this.$headers.each(function (headerIndex, th) {
        var j;
        var span;

        span = $(th).attr('colspan');
        if (span) {
          span = parseFloat(span);
        } else {
          span = 1;
        }

        for (j = 0; j < span; j += 1) {
          that.headerIndexLookup[that.headerIndexLookup.length] = headerIndex;
        }
      });
      OverviewTable.benchmark('Create lookup table from columnIndex to header_index');

      // Get the column types and install the column handlers.
      this.columnHandlers = [];
      $table.children('colgroup').children('col').each(function (columnIndex, col) {
        var columnType;

        that.columnHandlers[columnIndex] = null;

        columnType = $(col).attr('data-type');
        if (typeof columnType === 'undefined' || !OverviewTable.columnTypeHandlers[columnType]) {
          columnType = 'none';
        }

        that.columnHandlers[columnIndex] = new OverviewTable.columnTypeHandlers[columnType]();
        OverviewTable.benchmark('Install column handler with type "' + columnType + '"');

        // Initialize the column handler.
        that.columnHandlers[columnIndex].initHandler(that, columnIndex);
        OverviewTable.benchmark('Initialize column handler');

        // Initialize the filter.
        that.columnHandlers[columnIndex].initFilter(that, columnIndex);
        OverviewTable.benchmark('Initialize filter');

        // Initialize the sorter.
        that.columnHandlers[columnIndex].initSort(that, columnIndex);
        OverviewTable.benchmark('Initialize sorter');
      });

      // Execute additional initializations (if any)
      this.initHook();
      OverviewTable.benchmark('Execute additional initializations');

      if (OverviewTable.debug) {
        OverviewTable.log('End of create OverviewTable ' +
          (new Date().getTime() - OverviewTable.timeIntermidiate.getTime()) +
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
     *
     * @type {boolean}
     */
    OverviewTable.debug = false;

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Array with all registered overview tables.
     *
     * @type {{OverviewTable}}
     */
    OverviewTable.tables = {};

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Map from column data type to column type handler.
     *
     * @type {{}}
     */
    OverviewTable.columnTypeHandlers = {};

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Object with parameters which names equals values what use for replace specific characters.
     */
    OverviewTable.characterMap = {
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
     * Converts a string to lowercase and removes all diacritics.
     *
     * @param {string} string The string.
     *
     * @returns {string}
     */
    OverviewTable.toLowerCaseNoDiacritics = function (string) {
      var c;
      var i;
      var textNew = '';

      if (string === null || typeof string === 'undefined') {
        return string;
      }

      for (i = 0; i < string.length; i += 1) {
        c = string.substr(i, 1);
        if (OverviewTable.characterMap[c]) {
          textNew += OverviewTable.characterMap[c];
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
      OverviewTable.debug = true;
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Merges info about sorting of a column to sorting info of a table.
     *
     * @param {[]} tableSortInfo  De sorting metadata of the table.
     * @param {{}} columnSortInfo De sorting metadata of the column (on which sorting is requested).
     *
     * @returns {[]}
     */
    OverviewTable.mergeInfo = function (tableSortInfo, columnSortInfo) {
      if (tableSortInfo.length === 0) {
        // If selected only one column and sort info is empty, add column info
        columnSortInfo.sortOrder = 1;
        tableSortInfo[0] = columnSortInfo;
      } else {
        if (columnSortInfo.sortOrder !== -1 && tableSortInfo[columnSortInfo.sortOrder - 1]) {
          // If clicked column is already sorted and sort info contain info about this column,
          // change sort direction for it column.
          tableSortInfo[columnSortInfo.sortOrder - 1].sortDirection = columnSortInfo.sortDirection;
        } else {
          // If clicked column isn't sorted add this column info to sort info.
          columnSortInfo.sortOrder = tableSortInfo.length + 1;
          tableSortInfo[tableSortInfo.length] = columnSortInfo;
        }
      }

      return tableSortInfo;
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Returns the attribute name based on the (base)name of the attribute and sorting metadata of the column.
     *
     * @param {string} attributeName The (base)name of the attribute.
     * @param {int}    colSpan       The colspan of the column header.
     * @param {int}    offset        The offset of the column (relative the the column header).
     *
     * @returns {string}
     */
    OverviewTable.getAttributeName = function (attributeName, colSpan, offset) {
      if (colSpan === 1) {
        return attributeName;
      }

      return attributeName + '-' + (offset + 1);
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Returns sort order for a column.
     *
     * @param {jQuery} $header The table header of the column.
     * @param {int}    colSpan The colspan of the column header.
     * @param {int}    offset  The offset of the column (relative the the column header).
     *
     * @returns {int}
     */
    OverviewTable.getSortOrder = function ($header, colSpan, offset) {
      var order;

      order = $header.attr(OverviewTable.getAttributeName('data-sort-order', colSpan, offset));
      if (order === undefined) {
        return -1;
      }

      return parseInt(order, 10);
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Returns sorting direction of a column.
     *
     * @param {jQuery} $header The table header of the column.
     * @param {int}    colSpan The colspan of the column header.
     * @param {int}    offset  The offset of the column (relative the the column header).
     *
     * @returns {string}
     */
    OverviewTable.getSortDirection = function ($header, colSpan, offset) {
      if ($header.hasClass(OverviewTable.getAttributeName('sorted', colSpan, offset) + '-desc')) {
        return 'desc';
      }

      if ($header.hasClass(OverviewTable.getAttributeName('sorted', colSpan, offset) + '-asc')) {
        return 'asc';
      }

      return '';
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Returns the reversed sorting direction of a column.
     *
     * @param {jQuery} $header The table header of the column.
     * @param {int}    colSpan The colspan of the column header.
     * @param {int}    offset  The offset of the column (relative the the column header).
     *
     * @returns {string}
     */
    OverviewTable.getFlipSortDirection = function ($header, colSpan, offset) {
      var sortDirection;

      sortDirection = OverviewTable.getSortDirection($header, colSpan, offset);
      if (sortDirection === 'desc' || sortDirection === '') {
        return 'asc';
      }

      return 'desc';
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Sorts the table whn the user has clicked on a table header.
     *
     * @param {jQuery.Event}      event       The mouse click event.
     * @param {jQuery}            $header     The table header of the column.
     * @param {ColumnTypeHandler} column      The column type handler for the column.
     * @param {int}               columnIndex The index of the column.
     */
    OverviewTable.prototype.sort = function (event, $header, column, columnIndex) {
      var sortColumnInfo;
      var sortInfo;

      if (OverviewTable.debug) {
        OverviewTable.log('Start sort:');
        OverviewTable.timeStart = new Date();
        OverviewTable.timeIntermidiate = new Date();
      }

      // Get info about all currently sorted columns.
      sortInfo = this.getSortInfo();
      OverviewTable.benchmark('Get all sort info');

      // Get info about column what was selected for sort.
      sortColumnInfo = this.getColumnSortInfo(event, $header, columnIndex);
      OverviewTable.benchmark('Get info about current column');

      if (sortColumnInfo.sortDirection === undefined) {
        // The user has clicked between two columns of a column header with colspan 2.
        // Don't sort and return immediately.
        OverviewTable.benchmark('No sorting');
        return;
      }

      // Remove all classes concerning sorting from the column headers.
      this.cleanSortAttributes();
      OverviewTable.benchmark('Reset column headers');

      if (!event.ctrlKey) {
        sortInfo = OverviewTable.mergeInfo([], sortColumnInfo);
        OverviewTable.benchmark('Merge info');
        this.sortSingleColumn(sortInfo[0], column);
      } else {
        sortInfo = OverviewTable.mergeInfo(sortInfo, sortColumnInfo);
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

      if (OverviewTable.debug) {
        OverviewTable.log('Finish sort ' +
          (new Date().getTime() - OverviewTable.timeIntermidiate.getTime()) +
          'ms');
      }
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Returns an array indexed by the sort order with objects holding sorting information of the column.
     */
    OverviewTable.prototype.getSortInfo = function () {
      var columnsInfo = [];
      var dual;
      var sortOrder;
      var span;
      var that = this;

      this.$table.children('colgroup').children('col').each(function (columnIndex) {
        var $th = that.$headers.eq(that.headerIndexLookup[columnIndex]);

        span = $th.attr('colspan');
        if (!span || span === '1') {
          sortOrder = OverviewTable.getSortOrder($th, 1, 0);
          if (sortOrder !== -1) {
            columnsInfo[sortOrder - 1] = {
              columnIndex: columnIndex,
              colspan: 1,
              offset: 0,
              sortOrder: sortOrder,
              sortDirection: OverviewTable.getSortDirection($th, 1, 0)
            };
          }
        } else if (span === '2') {
          if (!dual || dual === 'right') {
            dual = 'left';
          } else {
            dual = 'right';
          }

          if (dual === 'left' && $th.hasClass('sort-1')) {
            sortOrder = OverviewTable.getSortOrder($th, 2, 0);
            if (sortOrder !== -1) {
              columnsInfo[sortOrder - 1] = {
                columnIndex: columnIndex,
                colspan: 2,
                offset: 0,
                sortOrder: sortOrder,
                sortDirection: OverviewTable.getSortDirection($th, 2, 0)
              };
            }
          }

          if (dual === 'right' && $th.hasClass('sort-2')) {
            sortOrder = OverviewTable.getSortOrder($th, 2, 1);
            if (sortOrder !== -1) {
              columnsInfo[sortOrder - 1] = {
                columnIndex: columnIndex,
                colspan: 2,
                offset: 1,
                sortOrder: sortOrder,
                sortDirection: OverviewTable.getSortDirection($th, 2, 1)
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
     * @param {jQuery} $header The table header of the column.
     * @param {int}    columnIndex
     *
     * @returns {{}}
     */
    OverviewTable.prototype.getColumnSortInfo = function (event, $header, columnIndex) {
      var columnInfo = {};
      var diff;
      var span;
      var widthCol1 = 0;
      var widthCol2 = 0;
      var widthHeader;
      var x;

      columnInfo.columnIndex = columnIndex;

      span = $header.attr('colspan');
      if (!span || span === '1') {
        columnInfo.colspan = 1;
        columnInfo.offset = 0;
        columnInfo.sortOrder = $header.attr('data-sort-order');
        columnInfo.sortDirection = OverviewTable.getFlipSortDirection($header, 1, 0);
      } else if (span === '2') {
        if ($header.hasClass('sort-1') && $header.hasClass('sort-2')) {
          // Header spans two columns and both columns can be used for sorting.
          x = event.pageX - $header.offset().left;

          if (this.headerIndexLookup[columnIndex] === this.headerIndexLookup[columnIndex - 1]) {
            // User clicked right column of a dual column header.
            widthCol1 = this.$table.children('tbody').find('tr:visible:first > td:eq(' + (columnIndex - 1) + ')').outerWidth();
            widthCol2 = this.$table.children('tbody').find('tr:visible:first > td:eq(' + columnIndex + ')').outerWidth();
          }

          if (this.headerIndexLookup[columnIndex] === this.headerIndexLookup[columnIndex + 1]) {
            // User clicked left column of a dual column header.
            widthCol1 = this.$table.children('tbody').find('tr:visible:first > td:eq(' + columnIndex + ')').outerWidth();
            widthCol2 = this.$table.children('tbody').find('tr:visible:first > td:eq(' + (columnIndex + 1) + ')').outerWidth();
          }

          widthHeader = $header.outerWidth();

          diff = widthHeader - widthCol1 - widthCol2;

          // We account diff due to cell separation.
          if (x < (widthCol1 - diff / 2)) {
            columnInfo.colspan = 2;
            columnInfo.offset = 0;
            columnInfo.sortOrder = $header.attr('data-sort-order-1');
            columnInfo.sortDirection = OverviewTable.getFlipSortDirection($header, 2, 0);
          } else if (x > (widthCol1 + diff / 2)) {
            columnInfo.colspan = 2;
            columnInfo.offset = 1;
            columnInfo.sortOrder = $header.attr('data-sort-order-2');
            columnInfo.sortDirection = OverviewTable.getFlipSortDirection($header, 2, 1);
          }
        } else if ($header.hasClass('sort-1')) {
          // Header spans two columns but only the first/left column can used for sorting.
          columnInfo.colspan = 2;
          columnInfo.offset = 0;
          columnInfo.sortOrder = $header.attr('data-sort-order-1');
          columnInfo.sortDirection = OverviewTable.getFlipSortDirection($header, 2, 0);
        } else if ($header.hasClass('sort-2')) {
          // Header spans two columns but only the second/right column can used for sorting.
          columnInfo.colspan = 2;
          columnInfo.offset = 1;
          columnInfo.sortOrder = $header.attr('data-sort-order-2');
          columnInfo.sortDirection = OverviewTable.getFlipSortDirection($header, 2, 1);
        }
      }
      // Colspan greater than 2 is not supported.

      return columnInfo;
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Removes all classes and data attributes concerning sorting from the column headers.
     */
    OverviewTable.prototype.cleanSortAttributes = function () {
      // Remove all orders for all columns.
      this.$table.children('thead').find('th').attr('data-sort-order', null);
      this.$table.children('thead').find('th').attr('data-sort-order-1', null);
      this.$table.children('thead').find('th').attr('data-sort-order-2', null);

      // Remove the asc and desc sort classes from all headers.
      this.$table.children('thead').find('th').removeClass('sorted-asc').removeClass('sorted-desc');
      this.$table.children('thead').find('th').removeClass('sorted-1-asc').removeClass('sorted-1-desc');
      this.$table.children('thead').find('th').removeClass('sorted-2-asc').removeClass('sorted-2-desc');
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Adds classes and data attributes concerning sorting to the column headers.
     *
     * @param {[]} tableSortInfo The sorting metadata of the table.
     */
    OverviewTable.prototype.addSortInfo = function (tableSortInfo) {
      var $header;
      var i;
      var order;

      for (i = 0; i < tableSortInfo.length; i += 1) {
        order = i + 1;
        $header = this.$headers.eq(this.headerIndexLookup[tableSortInfo[i].columnIndex]);
        $header.attr(OverviewTable.getAttributeName('data-sort-order', tableSortInfo[i].colspan, tableSortInfo[i].offset),
          order);
        $header.addClass(OverviewTable.getAttributeName('sorted',
            tableSortInfo[i].colspan, tableSortInfo[i].offset) + '-' + tableSortInfo[i].sortDirection);
      }
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Applies zebra theme on the table.
     */
    OverviewTable.prototype.applyZebraTheme = function () {
      var even = true;

      // Note: Using this.style.display is faster than using children('tr:visible').
      this.$table.children('tbody').children('tr').each(function () {
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
     * @param {{}}                sortingInfo The metadata for sorting of this table.
     * @param {ColumnTypeHandler} column      The column type handler for the column.
     */
    OverviewTable.prototype.sortSingleColumn = function (sortingInfo, column) {
      var cell;
      var i;
      var rows;
      var sortDirection;
      var tbody;

      // Get the sort direction.
      if (sortingInfo.sortDirection === 'asc') {
        sortDirection = 1;
      } else {
        sortDirection = -1;
      }

      // Get all the rows of the table.
      rows = this.$table.children('tbody').children('tr').get();

      // Pull out the sort keys of the table cells.
      for (i = 0; i < rows.length; i += 1) {
        cell = rows[i].cells[sortingInfo.columnIndex];
        rows[i].sortKey = column.getSortKey(cell);
      }
      OverviewTable.benchmark('Extracting sort keys');

      // Actually sort the rows.
      rows.sort(function (row1, row2) {
        return sortDirection * column.compareSortKeys(row1.sortKey, row2.sortKey);
      });
      OverviewTable.benchmark('Sorted by one column');

      // Reappend the rows to the table body.
      tbody = this.$table.children('tbody')[0];
      for (i = 0; i < rows.length; i += 1) {
        rows[i].sortKey = null;
        tbody.appendChild(rows[i]);
      }
      OverviewTable.benchmark('Reappend the sorted rows');
    };

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Sorts the table by two or more columns.
     *
     * @param {[]} tableSortingInfo The sorting metadata of this table.
     */
    OverviewTable.prototype.sortMultiColumn = function (tableSortingInfo) {
      var cell;
      var columnHandler;
      var dir;
      var i;
      var j;
      var multiCmp = null;
      var rows;
      var sortFunc = '';
      var tbody;
      var this1 = this;  // Is required by multiCmp.

      // Get all the rows of the table.
      rows = this.$table.children('tbody').children('tr').get();

      for (i = 0; i < rows.length; i += 1) {
        rows[i].sortKey = [];
        for (j = 0; j < tableSortingInfo.length; j += 1) {
          columnHandler = this.columnHandlers[tableSortingInfo[j].columnIndex];

          // Pull out the sort keys of the table cells.
          cell = rows[i].cells[tableSortingInfo[j].columnIndex];
          rows[i].sortKey[j] = columnHandler.getSortKey(cell);
        }
      }
      OverviewTable.benchmark('Extracting sort keys');

      sortFunc += 'multiCmp = function (row1, row2) {\n';
      sortFunc += '  var cmp;\n';
      for (i = 0; i < tableSortingInfo.length; i += 1) {
        dir = 1;
        if (tableSortingInfo[i].sortDirection === 'desc') {
          dir = -1;
        }
        sortFunc += '  cmp = this1.columnHandlers[' +
          tableSortingInfo[i].columnIndex +
          '].compareSortKeys(row1.sortKey[' +
          i + '], row2.sortKey[' +
          i + ']);\n';
        sortFunc += '  if (cmp !== 0) {\n';
        sortFunc += '    return cmp * ' + dir + ';\n';
        sortFunc += '  }\n';
      }
      sortFunc += '  return 0;\n';
      sortFunc += '};\n';
      eval(sortFunc);
      OverviewTable.benchmark('Prepare multi sort function');

      // Actually sort the rows.
      rows.sort(multiCmp);
      OverviewTable.benchmark('Sorted by ' + tableSortingInfo.length + ' columns');

      // Reappend the rows to the table body.
      tbody = this.$table.children('tbody')[0];
      for (i = 0; i < rows.length; i += 1) {
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
      var count;
      var filters = [];
      var i;
      var that = this;

      if (OverviewTable.debug) {
        OverviewTable.log('Apply filters:');
        OverviewTable.timeStart = new Date();
        OverviewTable.timeIntermidiate = new Date();
      }

      // Create a list of effective filters.
      count = 0;
      for (i = 0; i < this.columnHandlers.length; i += 1) {
        if (this.columnHandlers[i] && this.columnHandlers[i].startFilter()) {
          filters[i] = this.columnHandlers[i];
          count += 1;
        } else {
          filters[i] = null;
        }
      }
      OverviewTable.benchmark('Create a list of effective filters');


      if (count === 0) {
        if (OverviewTable.debug) {
          OverviewTable.log('Filters list is empty.');
        }

        // All filters are ineffective. Show all rows.
        this.$table.children('tbody').children('tr').show();
        OverviewTable.benchmark('Show all rows');

      } else {
        // One or more filters are effective.

        // Hide all rows.
        this.$table.children('tbody').children('tr').hide();
        OverviewTable.benchmark('Hide all rows');

        // Apply all effective filters.
        this.$table.children('tbody').children('tr').each(function () {
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

      if (OverviewTable.debug) {
        OverviewTable.log('Finish, total time: ' +
          (new Date().getTime() - OverviewTable.timeIntermidiate.getTime()) + ' ms');
      }
    };

    //------------------------------------------------------------------------------------------------------------------
    OverviewTable.registerColumnTypeHandler = function (columnType, handler) {
      OverviewTable.columnTypeHandlers[columnType] = handler;
    };

    //------------------------------------------------------------------------------------------------------------------
    OverviewTable.filterTrigger = function (event) {
      event.data.table.filter(event, event.data.element);
    };

    //------------------------------------------------------------------------------------------------------------------
    OverviewTable.benchmark = function (message) {
      if (OverviewTable.debug === true) {
        OverviewTable.log(message + ' ' + (new Date().getTime() - OverviewTable.timeStart.getTime()) + ' ms');
        OverviewTable.timeStart = new Date();
      }
    };

    //------------------------------------------------------------------------------------------------------------------
    OverviewTable.log = function (s) {
      if (typeof console !== 'undefined' && typeof console.debug !== 'undefined') {
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
      if (typeof className === 'undefined') {
        className = 'SetBased/Abc/Table/OverviewTable';
      }

      $(selector).each(function () {
        var $this1 = $(this);

        if ($this1.is('table')) {
          // Selector is a table.
          if (!$this1.hasClass('registered')) {
            require([className],
              function (Constructor) {
                OverviewTable.tables[OverviewTable.tables.length] = new Constructor($this1);
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
                  OverviewTable.tables[OverviewTable.tables.length] = new Constructor($this2);
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
