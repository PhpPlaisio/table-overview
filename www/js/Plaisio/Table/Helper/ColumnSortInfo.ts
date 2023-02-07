/**
 * Structure for sorting info of a column.
 */
export class ColumnSortInfo
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * The number of columns spanned by the header: 1 or 2.
   */
  public colspan: number;

  /**
   * The index of the column in the table.
   */
  public columnIndex: number;

  /**
   * The offset in dual columns: 0 left column, 1 right column.
   */
  public offset: number;

  /**
   * The sorting directions: asc of desc.
   */
  public sortDirection: string;

  /**
   * The order of the column in the columns on which the table is sorted.
   */
  public sortOrder: number;

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Object constructor.
   *
   * @param colspan       The number of columns spanned by the header: 1 or 2.
   * @param columnIndex   The index of the column in the table.
   * @param offset        The offset in dual columns: 0 left column, 1 right column.
   * @param sortDirection The sorting directions: asc of desc.
   * @param sortOrder     The order of the column in the columns on which the table is sorted.
   */
  public constructor(colspan: number       = 1,
                     columnIndex: number   = 0,
                     offset: number        = 0,
                     sortDirection: string = '',
                     sortOrder: number     = -1)
  {
    this.colspan       = colspan;
    this.columnIndex   = columnIndex;
    this.offset        = offset;
    this.sortDirection = sortDirection;
    this.sortOrder     = sortOrder;
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
// Plaisio\Console\TypeScript\Helper\MarkHelper::md5: 70f147d7591eb9ba68fbf20389528b90
