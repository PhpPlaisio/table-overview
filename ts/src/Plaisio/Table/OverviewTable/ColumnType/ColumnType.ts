import {OverviewTable} from "../OverviewTable";

/**
 * Interface for column types.
 */
export interface ColumnType
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns true if the row filter must take this column filter in to account. Returns false otherwise.
   */
  startFilter(): boolean;

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Initializes the sorting for the column.
   *
   * @param table The overview table object of the table of the column of this column type handler.
   * @param index The column index of the column of the table of the column of this  column type handler.
   */
  initSort(table: OverviewTable, index: number): void;

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the content of a table cell for sorting.
   *
   * @param tableCell The table cell.
   */
  getSortKey(tableCell): string

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns true if the table (based on this column filter) must be shown. Returns false otherwise.
   *
   * @param tableCell The table cell.
   */
  simpleFilter(tableCell: HTMLTableCellElement): boolean

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Initializes the filter for the column.
   *
   * @param table The overview table object of the table of the column of this column type handler.
   * @param columnIndex In index of the column in the table.
   * @param mq The media query.
   */
  initFilter(table: OverviewTable, columnIndex: number, mq: MediaQueryList): void

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @param mq The media query list object (must match for small screens).
   */
  mediaChange(mq: MediaQueryList): void;

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------