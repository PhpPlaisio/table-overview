import {OverviewTable} from '../OverviewTable';

/**
 * Interface for column types.
 */
export interface TableColumn
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Compares two values for sorting.
   */
  compareSortKeys(value1: any, value2: any): number

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the content of a table cell for sorting.
   *
   * @param tableCell The table cell.
   */
  getSortKey(tableCell: HTMLTableCellElement): any

  //------------------------------------------------------------------------------------------------------------------
  /**
   * Initializes this column.
   */
  initColumn(table: OverviewTable, columnIndex: number): void;

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Initializes the filter of this column.
   *
   * @param table       The overview table object of the table of this column.
   * @param columnIndex The index of this column in the table.
   * @param mq          The media query.
   */
  initFilter(table: OverviewTable, columnIndex: number, mq: MediaQueryList): void;

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Initializes the sorting for this column.
   *
   * @param table The overview table object of the table of this column .
   * @param index The index of this column in the table.
   */
  initSort(table: OverviewTable, index: number): void;

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @param mq The media query list object (must match for small screens).
   */
  mediaChange(mq: MediaQueryList): void;

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns true if the table (based on this column filter) must be shown. Returns false otherwise.
   *
   * @param tableCell The table cell.
   */
  simpleFilter(tableCell: HTMLTableCellElement): boolean

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns true if the row filter must take this column filter in to account. Returns false otherwise.
   */
  startFilter(): boolean;

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
// Plaisio\Console\Helper\TypeScript\TypeScriptMarkHelper::md5: fec010e5a36a8bfabb126e430d10198a
