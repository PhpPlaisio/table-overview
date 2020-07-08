/**
 * Structure for sorting info of a column.
 */
export class ColumnSortInfo
{
  /**
   * The sorting directions: asc of desc.
   */
  public sortDirection: string;

  /**
   * The index of the column in the table.
   */
  public columnIndex: number;

  /**
   * The number of columns spanned by the header: 1 or 2.
   */
  public colspan: number;

  /**
   * The offset in dual columns: 0 left column, 1 right column.
   */
  public offset: number;

  /**
   * The order of the column in the columns on which the table is sorted.
   */
  public sortOrder: number;
}
