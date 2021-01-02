import {Cast} from '../Helper/Cast';
import {ColumnSortInfo} from './Helper/ColumnSortInfo';
import {TableColumn} from './TableColumn/TableColumn';

/**
 * Class enabling filtering and soring of overview tables.
 */
export class OverviewTable
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Name of the event triggered after filtering on a table has ended.
   */
  public static readonly FILTERING_ENDED = 'overview-table-filtering-ended';

  /**
   * All registered tables.
   */
  protected static tables: OverviewTable[] = [];

  /**
   * All available column type handler classes.
   */
  private static TableColumnHandlers: Map<string, TableColumn['constructor']> =
    new Map<string, TableColumn['constructor']>();

  /**
   * If and only if true debug and profiling message are logged on the console.
   */
  private static debug: boolean = false;

  /**
   * The HTML table cells with filters of this HTML table.
   */
  public $filters: JQuery;

  /**
   * The HTML headers of this HTML table.
   */
  public $headers: JQuery;

  /**
   * Lookup from column index to header index.
   */
  public headerIndexLookup = Array<number>();

  /**
   * The CSS module class.
   */
  protected moduleClass: string;

  /**
   * The columns headers of this table.
   */
  private columnHandlers: TableColumn[] = [];

  /**
   * The intermediate time (for bugging and profiling).
   */
  private timeIntermediate: Date;

  /**
   * The start time (for bugging and profiling).
   */
  private timeStart: Date;

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Object constructor.
   *
   * @param $table The jQuery object of the table.
   * @param mq The media query list object (must match for small screens).
   */
  public constructor(protected $table: JQuery, protected mq: MediaQueryList)
  {
    this.timeStart        = new Date();
    this.timeIntermediate = new Date();

    if (OverviewTable.debug)
    {
      this.log('Start create OverviewTable:');
    }

    this.moduleClass = Cast.toManString($table.attr('data-overview-table'));
    const rowClass   = '.' + this.moduleClass + '-filter-row';
    this.$filters    = $table.children('thead').children(rowClass).find('td');
    this.$headers    = $table.children('thead').children(rowClass).find('th');
    this.logProfile('Prepare table and table info');

    this.initColumnMap();
    this.initColumnHeaders();
    this.initMediaChange();
    this.logProfile('Execute additional initializations');

    if (OverviewTable.debug)
    {
      this.log('End of create OverviewTable ' +
        (new Date().getTime() - this.timeIntermediate.getTime()) + 'ms');
    }
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Enables profiling and debugging console messages.
   */
  public static enableDebug(): void
  {
    OverviewTable.debug = true;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Merges info about sorting of a column to sorting info of a table.
   *
   * @param tableSortInfo  De sorting metadata of the table.
   * @param columnSortInfo De sorting metadata of the column (on which sorting is requested).
   *
   * @returns
   */
  static mergeInfo(tableSortInfo: ColumnSortInfo[], columnSortInfo: ColumnSortInfo): ColumnSortInfo[]
  {
    if (tableSortInfo.length === 0)
    {
      // If selected only one column and sort info is empty, add column info
      columnSortInfo.sortOrder = 1;
      tableSortInfo[0]         = columnSortInfo;
    }
    else
    {
      if (columnSortInfo.sortOrder !== -1 && tableSortInfo[columnSortInfo.sortOrder - 1])
      {
        // If clicked column is already sorted and sort info contain info about this column,
        // change sort direction for it column.
        tableSortInfo[columnSortInfo.sortOrder - 1]['sortDirection'] = columnSortInfo.sortDirection;
      }
      else
      {
        // If clicked column isn't sorted add this column info to sort info.
        columnSortInfo.sortOrder = tableSortInfo.length + 1;
        tableSortInfo.push(columnSortInfo);
      }
    }

    return tableSortInfo;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Registers tables that matches a jQuery selector as an OverviewTable.
   *
   * @param selector The jQuery selector.
   * @param mq The media query list object (must match for small screens).
   */
  public static registerTable(selector: string, mq: MediaQueryList)
  {
    const that = this;

    $(selector).each(function ()
    {
      let $table = $(this);

      if (!$table.is('table'))
      {
        // Selector is not a table. Find the table below the selector.
        $table = $table.find('table').first();
      }

      if ($table.attr('data-overview-table') && !$table.hasClass('is-registered'))
      {
        OverviewTable.tables.push(new that($table, mq));
        $table.addClass('is-registered');
      }
    });
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Registers a table column type.
   *
   * @param TableColumn The name of the column type.
   * @param handler The handler for the column type.
   */
  public static registerTableColumn(TableColumn: string, handler: TableColumn['constructor']): void
  {
    OverviewTable.TableColumnHandlers.set(TableColumn, handler);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Converts a string to lowercase and removes all diacritics.
   *
   * @param string The string.
   */
  public static toLowerCaseNoDiacritics(string: string | null): string
  {
    if (string === null)
    {
      return '';
    }

    // See https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Adds classes and data attributes concerning sorting to the column headers.
   *
   * @param tableSortInfo The sorting metadata of the table.
   */
  public addSortInfo(tableSortInfo: ColumnSortInfo[]): void
  {
    for (let i = 0; i < tableSortInfo.length; i += 1)
    {
      const order   = i + 1;
      const $header = this.$headers.eq(this.headerIndexLookup[tableSortInfo[i].columnIndex]);
      $header.attr(this.getAttributeName('data-sort-order',
        tableSortInfo[i].colspan,
        tableSortInfo[i].offset),
        order);
      $header.addClass(this.getAttributeName('is-sorted',
        tableSortInfo[i].colspan,
        tableSortInfo[i].offset) + '-' + tableSortInfo[i].sortDirection);
    }
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Applies zebra theme on the table.
   */
  public applyZebraTheme(): void
  {
    let even: boolean = true;

    // Note: Using this.style.display is faster than using children('tr:visible').
    this.$table.children('tbody').children('tr').each(function ()
    {
      let $this = $(this);

      if (this.style.display !== 'none')
      {
        if (even)
        {
          $this.removeClass('is-odd').addClass('is-even');
        }
        else
        {
          $this.removeClass('is-even').addClass('is-odd');
        }
        even = !even;
      }
    });
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the width of a column.
   *
   * @param columnIndex The index of the column in the table.
   */
  public columnWidth(columnIndex: number): number
  {
    return this.$table.children('tbody').find('tr:visible:first > td:eq(' + columnIndex + ')').outerWidth() || 0;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Filters out table rows based on the value of the filters.
   */
  public filter(): void
  {
    if (OverviewTable.debug)
    {
      this.log('Apply filters:');
      this.timeStart        = new Date();
      this.timeIntermediate = new Date();
    }

    // Create a list of effective filters.
    let filters: (TableColumn | null)[] = [];
    let count: number                   = 0;
    for (let i: number = 0; i < this.columnHandlers.length; i += 1)
    {
      if (this.columnHandlers[i] && this.columnHandlers[i].startFilter())
      {
        filters[i] = this.columnHandlers[i];
        count += 1;
      }
      else
      {
        filters[i] = null;
      }
    }
    this.logProfile('Create a list of effective filters');

    if (count === 0)
    {
      if (OverviewTable.debug)
      {
        this.log('Filters list is empty.');
      }

      // All filters are ineffective. Show all rows.
      this.$table.children('tbody').children('tr').css('display', '');
      this.logProfile('Show all rows');
    }
    else
    {
      // One or more filters are effective.

      // Hide all rows.
      this.$table.children('tbody').children('tr').css('display', 'none');
      this.logProfile('Hide all rows');

      // Apply all effective filters.
      this.$table.children('tbody').children('tr').each(function ()
      {
        let show  = 1;
        let $this = $(this);

        for (let j = 0; j < filters.length; j += 1)
        {
          // @ts-ignore
          if (filters[j] && !(filters[j].simpleFilter(this.cells[j])))
          {
            // The table cell does not match the filter. Don't show the row.
            show = 0;
            // There is no need to apply other filters on this row.
            break;
          }
        }

        if (show === 1)
        {
          // The row matches all filters. Show the row.
          $this.css('display', '');
        }
      });
      this.logProfile('Apply all effective filters');
    }

    this.applyZebraTheme();
    this.logProfile('Apply zebra theme');

    this.$table.trigger(OverviewTable.FILTERING_ENDED);

    if (OverviewTable.debug)
    {
      this.log('Finish, total time: ' + (new Date().getTime() - this.timeIntermediate.getTime()) + ' ms');
    }
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Triggers the filtering of this table.
   *
   * @param event The event that fired.
   */
  public filterTrigger(event: JQuery.TriggeredEvent): void
  {
    event.data.table.filter();
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns object with info about sorting of a column.
   *
   * @param event The event that triggers the sorting.
   * @param $header The table header of the column.
   * @param columnIndex The index of the column.
   */
  public getColumnSortInfo(event: JQuery.TriggeredEvent, $header: JQuery, columnIndex: number): ColumnSortInfo
  {
    let columnInfo         = new ColumnSortInfo();
    columnInfo.columnIndex = columnIndex;

    const span = $header.attr('colspan');
    if (!span || span === '1')
    {
      columnInfo.colspan       = 1;
      columnInfo.offset        = 0;
      columnInfo.sortOrder     = parseInt($header.attr('data-sort-order') || '-1', 10);
      columnInfo.sortDirection = this.getFlipSortDirection($header, 1, 0);
    }
    else if (span === '2')
    {
      if ($header.hasClass('is-sortable-1') && $header.hasClass('is-sortable-2'))
      {
        // Header spans two columns and both columns can be used for sorting.
        let widthCol1 = 0;
        let widthCol2 = 0;
        let x: number = 0;
        const offset  = $header.offset();
        if (event.pageX && offset)
        {
          x = event.pageX - offset.left;
        }

        if (this.headerIndexLookup[columnIndex] === this.headerIndexLookup[columnIndex - 1])
        {
          // User clicked right column of a dual column header.
          widthCol1 = this.columnWidth(columnIndex - 1);
          widthCol2 = this.columnWidth(columnIndex);
        }

        if (this.headerIndexLookup[columnIndex] === this.headerIndexLookup[columnIndex + 1])
        {
          // User clicked left column of a dual column header.
          widthCol1 = this.columnWidth(columnIndex);
          widthCol2 = this.columnWidth(columnIndex + 1);
        }

        const widthHeader: number = $header.outerWidth() || 0;
        const diff: number        = widthHeader - widthCol1 - widthCol2;

        // We account diff due to cell separation.
        if (x < (widthCol1 - diff / 2))
        {
          columnInfo.colspan       = 2;
          columnInfo.offset        = 0;
          columnInfo.sortOrder     = parseInt($header.attr('data-sort-order-1') || '-1', 10);
          columnInfo.sortDirection = this.getFlipSortDirection($header, 2, 0);
        }
        else if (x > (widthCol1 + diff / 2))
        {
          columnInfo.colspan       = 2;
          columnInfo.offset        = 1;
          columnInfo.sortOrder     = parseInt($header.attr('data-sort-order-2') || '-1', 10);
          columnInfo.sortDirection = this.getFlipSortDirection($header, 2, 1);
        }
      }
      else if ($header.hasClass('is-sortable-1'))
      {
        // Header spans two columns but only the first/left column can used for sorting.
        columnInfo.colspan       = 2;
        columnInfo.offset        = 0;
        columnInfo.sortOrder     = parseInt($header.attr('data-sort-order-1') || '-1', 10);
        columnInfo.sortDirection = this.getFlipSortDirection($header, 2, 0);
      }
      else if ($header.hasClass('is-sortable-2'))
      {
        // Header spans two columns but only the second/right column can used for sorting.
        columnInfo.colspan       = 2;
        columnInfo.offset        = 1;
        columnInfo.sortOrder     = parseInt($header.attr('data-sort-order-2') || '-1', 10);
        columnInfo.sortDirection = this.getFlipSortDirection($header, 2, 1);
      }
    }
    // Colspan greater than 2 is not supported.

    return columnInfo;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the reversed sorting direction of a column.
   *
   * @param $header The table header of the column.
   * @param colSpan The colspan of the column header.
   * @param offset  The offset of the column (relative the the column header).
   */
  public getFlipSortDirection($header: JQuery, colSpan: number, offset: number): string
  {
    const sortDirection = this.getSortDirection($header, colSpan, offset);
    if (sortDirection === 'desc' || sortDirection === '')
    {
      return 'asc';
    }

    return 'desc';
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the sorting direction of a column.
   *
   * @param $header The table header of the column.
   * @param colSpan The colspan of the column header.
   * @param offset  The offset of the column (relative the the column header).
   */
  public getSortDirection($header: JQuery, colSpan: number, offset: number): string
  {
    if ($header.hasClass(this.getAttributeName('is-sorted', colSpan, offset) + '-desc'))
    {
      return 'desc';
    }

    if ($header.hasClass(this.getAttributeName('is-sorted', colSpan, offset) + '-asc'))
    {
      return 'asc';
    }

    return '';
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns sort order for a column.
   *
   * @param $header The table header of the column.
   * @param colSpan The colspan of the column header.
   * @param offset  The offset of the column (relative the the column header).
   */
  public getSortOrder($header: JQuery, colSpan: number, offset: number): number
  {
    const order = $header.attr(this.getAttributeName('data-sort-order', colSpan, offset));
    if (order === undefined)
    {
      return -1;
    }

    return parseInt(order, 10);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Sorts the table whn the user has clicked on a table header.
   *
   * @param event       The mouse click event.
   * @param $header     The table header of the column.
   * @param column      The column type handler for the column.
   * @param columnIndex The index of the column.
   */
  public sort(event: JQuery.TriggeredEvent,
              $header: JQuery,
              column: TableColumn,
              columnIndex: number): void
  {
    if (!$(event.target).hasClass('no-sort'))
    {
      if (OverviewTable.debug)
      {
        this.log('Start sort:');
        this.timeStart        = new Date();
        this.timeIntermediate = new Date();
      }

      // Get info about all currently sorted columns.
      let sortInfo = this.getSortInfo();
      this.logProfile('Get all sort info');

      // Get info about column what was selected for sort.
      const sortColumnInfo = this.getColumnSortInfo(event, $header, columnIndex);
      this.logProfile('Get info about current column');

      if (sortColumnInfo.sortDirection === null)
      {
        // The user has clicked between two columns of a column header with colspan 2.
        // Don't sort and return immediately.
        this.logProfile('No sorting');
        return;
      }

      // Remove all classes concerning sorting from the column headers.
      this.cleanSortAttributes();
      this.logProfile('Reset column headers');

      if (!event.ctrlKey)
      {
        sortInfo = OverviewTable.mergeInfo([], sortColumnInfo);
        this.logProfile('Merge info');
        this.sortSingleColumn(sortInfo[0], column);
      }
      else
      {
        sortInfo = OverviewTable.mergeInfo(sortInfo, sortColumnInfo);
        this.logProfile('Merge info');
        if (sortInfo.length === 1)
        {
          this.sortSingleColumn(sortInfo[0], column);
        }
        else
        {
          this.sortMultiColumn(sortInfo);
        }
      }

      // Add classes concerning sorting to the column headers.
      this.addSortInfo(sortInfo);
      this.logProfile('Added info to table head');

      // Apply zebra theme for the table.
      this.applyZebraTheme();
      this.logProfile('Apply zebra theme');

      if (OverviewTable.debug)
      {
        this.log('Finish sort ' + (new Date().getTime() - this.timeIntermediate.getTime()) + 'ms');
      }
    }
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Sorts the table by two or more columns.
   *
   * @param tableSortingInfo The sorting metadata of this table.
   */
  public sortMultiColumn(tableSortingInfo: ColumnSortInfo[]): void
  {
    let multiCmp;
    let this1 = this;  // Is required by multiCmp.

    // Get all the rows of the table.
    let rows = this.$table.children('tbody').children('tr').get();

    for (let i = 0; i < rows.length; i += 1)
    {
      (rows[i] as any)['sortKey'] = [];
      for (let j = 0; j < tableSortingInfo.length; j += 1)
      {
        let columnHandler = this.columnHandlers[tableSortingInfo[j].columnIndex];

        // Pull out the sort keys of the table cells.
        let cell                    = (<HTMLTableRowElement>rows[i]).cells[tableSortingInfo[j].columnIndex];
        (rows[i] as any).sortKey[j] = columnHandler.getSortKey(cell);
      }
    }
    this.logProfile('Extracting sort keys');

    let sortFunc = 'multiCmp = function (row1, row2) {\n';
    sortFunc += '  let cmp;\n';
    for (let i = 0; i < tableSortingInfo.length; i += 1)
    {
      let dir = 1;
      if (tableSortingInfo[i].sortDirection === 'desc')
      {
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
    this.logProfile('Prepare multi sort function');

    // Actually sort the rows.
    rows.sort(multiCmp);
    this.logProfile('Sorted by ' + tableSortingInfo.length + ' columns');

    // Re-append the rows to the table body.
    let tbody = this.$table.children('tbody')[0];
    for (let i = 0; i < rows.length; i += 1)
    {
      (rows[i] as any)['sortKey'] = null;
      tbody.appendChild(rows[i]);
    }
    this.logProfile('Reappend the sorted rows');
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Sorts the table by one column.
   *
   * @param sortingInfo The metadata for sorting of this table.
   * @param column      The column type handler for the column.
   */
  public sortSingleColumn(sortingInfo: ColumnSortInfo, column: TableColumn): void
  {
    // Get the sort direction.
    const sortDirection = (sortingInfo.sortDirection === 'asc') ? 1 : -1;

    // Get all the rows of the table.
    let rows = this.$table.children('tbody').children('tr').get();

    // Pull out the sort keys of the table cells.
    for (let i = 0; i < rows.length; i += 1)
    {
      let cell                 = (rows[i] as any).cells[sortingInfo.columnIndex];
      (rows[i] as any).sortKey = column.getSortKey(cell);
    }
    this.logProfile('Extracting sort keys');

    // Actually sort the rows.
    rows.sort(function (row1, row2)
    {
      return sortDirection * column.compareSortKeys((row1 as any).sortKey, (row2 as any).sortKey);
    });
    this.logProfile('Sorted by one column');

    // Reappend the rows to the table body.
    const tbody = this.$table.children('tbody')[0];
    for (let i = 0; i < rows.length; i += 1)
    {
      (rows[i] as any).sortKey = null;
      tbody.appendChild(rows[i]);
    }
    this.logProfile('Reappend the sorted rows');
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Removes all classes and data attributes concerning sorting from the column headers.
   */
  private cleanSortAttributes(): void
  {
    // Remove all orders for all columns.
    const headerClass = '.' + this.moduleClass + '-header';
    this.$table.children('thead').find(headerClass)
        .attr('data-sort-order', null)
        .attr('data-sort-order-1', null)
        .attr('data-sort-order-2', null)
        .removeClass('is-sorted-asc')
        .removeClass('is-sorted-desc')
        .removeClass('is-sorted-1-asc')
        .removeClass('is-sorted-1-desc')
        .removeClass('is-sorted-2-asc')
        .removeClass('is-sorted-2-desc');
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the attribute name based on the (base)name of the attribute and sorting metadata of the column.
   *
   * @param attributeName The (base)name of the attribute.
   * @param colSpan       The colspan of the column header.
   * @param offset        The offset of the column (relative to the column header).
   */
  private getAttributeName(attributeName: string, colSpan: number, offset: number): string
  {
    if (colSpan === 1)
    {
      return attributeName;
    }

    return attributeName + '-' + (offset + 1);
  }

  //------------------------------------------------------------------------------------------------------------------
  /**
   * Returns an array indexed by the sort order with objects holding sorting information of the column.
   */
  private getSortInfo(): ColumnSortInfo[]
  {
    let columnsInfo: ColumnSortInfo[] = [];
    let dual: string | null;
    let sortOrder;
    const that                        = this;

    this.$table.children('colgroup').children('col').each(function (columnIndex: number)
    {
      let $th = that.$headers.eq(that.headerIndexLookup[columnIndex]);

      let span = $th.attr('colspan');
      if (!span || span === '1')
      {
        sortOrder = that.getSortOrder($th, 1, 0);
        if (sortOrder !== -1)
        {
          columnsInfo[sortOrder - 1] = new ColumnSortInfo(1, columnIndex, 0, that.getSortDirection($th, 1, 0), sortOrder);
        }
      }
      else if (span === '2')
      {
        if (!dual || dual === 'right')
        {
          dual = 'left';
        }
        else
        {
          dual = 'right';
        }

        if (dual === 'left' && $th.hasClass('is-sortable-1'))
        {
          sortOrder = that.getSortOrder($th, 2, 0);
          if (sortOrder !== -1)
          {
            columnsInfo[sortOrder - 1] = new ColumnSortInfo(2, columnIndex, 0, that.getSortDirection($th, 2, 0), sortOrder);
          }
        }

        if (dual === 'right' && $th.hasClass('is-sortable-2'))
        {
          sortOrder = that.getSortOrder($th, 2, 1);
          if (sortOrder !== -1)
          {
            columnsInfo[sortOrder - 1] = new ColumnSortInfo(2, columnIndex, 1, that.getSortDirection($th, 2, 1), sortOrder);
          }
        }
      }
    });

    return columnsInfo;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Initializes the column type handlers and types.
   */
  private initColumnHeaders(): void
  {
    const that = this;

    this.$table.children('colgroup').children('col').each(function (columnIndex: number, col: HTMLElement)
    {
      let TableColumn = $(col).attr('data-type');
      if (!TableColumn || !OverviewTable.TableColumnHandlers.has(TableColumn))
      {
        TableColumn = 'none';
      }

      const tmp: any                   = OverviewTable.TableColumnHandlers.get(TableColumn);
      that.columnHandlers[columnIndex] = new tmp();
      that.logProfile('Install column handler with type "' + TableColumn + '"');

      that.columnHandlers[columnIndex].initColumn(that, columnIndex);
      that.logProfile('Initialize column');

      that.columnHandlers[columnIndex].initFilter(that, columnIndex, that.mq);
      that.logProfile('Initialize filter');

      that.columnHandlers[columnIndex].initSort(that, columnIndex);
      that.logProfile('Initialize sorter');
    });
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Initializes the map from column index to header index. Column headers can span 1 or 2 columns.
   */
  private initColumnMap(): void
  {
    const that = this;
    this.$headers.each(function (headerIndex: number, th: HTMLElement)
    {
      const colspan: number = parseInt($(th).attr('colspan') || '1', 10);

      for (let j = 0; j < colspan; j += 1)
      {
        that.headerIndexLookup.push(headerIndex);
      }
    });

    this.logProfile('Init lookup table from columnIndex to header_index');
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Install and fire media change event handler.
   */
  private initMediaChange(): void
  {
    const that = this;

    if (this.mq)
    {
      this.mq.addListener(function ()
      {
        that.mediaChange(that.mq);
      });
    }

    $(window).on('resize', function ()
    {
      that.mediaChange(that.mq);
    });

    this.mediaChange(this.mq);

    this.logProfile('Initialize media change event handlers');
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Logs an message to the console.
   *
   * @param message The messages.
   */
  private log(message: string): void
  {
    if (console && console.debug)
    {
      console.log(message);
    }
    else
    {
      alert(message);
    }
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Logs a profiling message to the console.
   *
   * @param message
   */
  private logProfile(message: string): void
  {
    if (OverviewTable.debug === true)
    {
      this.log(message + ' ' + (new Date().getTime() - this.timeStart.getTime()) + ' ms');
      this.timeStart = new Date();
    }
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @param mq The media query list object (must match for small screens).
   */
  private mediaChange(mq: MediaQueryList): void
  {
    const that           = this;
    const filterRowClass = '.' + this.moduleClass + '-filter-row';

    if (mq && mq.matches)
    {
      // Small screen.
      this.$table.children('thead').children(filterRowClass).css('display', 'none');
    }
    else
    {
      // Large screen. Display the row with table filters.
      this.$table.children('thead').children(filterRowClass).find('input')
          .css('opacity', '1').css('visibility', 'visible').css('display', 'none').fadeIn(200);
    }

    this.$table.children('colgroup').children('col').each(function (columnIndex: number)
    {
      that.columnHandlers[columnIndex].mediaChange(mq);
    });
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
// Plaisio\Console\Helper\TypeScript\TypeScriptMarkHelper::md5: 35c2820a96c45c0bc5206049266d4c6b
