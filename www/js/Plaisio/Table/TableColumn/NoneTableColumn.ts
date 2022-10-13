import {OverviewTable} from 'Plaisio/Table/OverviewTable';
import {TableColumn} from 'Plaisio/Table/TableColumn/TableColumn';

/**
 * Table column for columns that don't require filtering and sorting.
 */
export class NoneTableColumn implements TableColumn
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  compareSortKeys(value1: any, value2: any): number
  {
    return 0;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  getSortKey(tableCell: HTMLTableCellElement): any
  {
    return '';
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  public initColumn(table: OverviewTable, columnIndex: number): void
  {
    // Nothing to do.
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  initFilter(table: OverviewTable, columnIndex: number): void
  {
    // Nothing to do.
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  public initSort(table: OverviewTable, index: number): void
  {
    // Nothing to do.
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  public mediaChange(mq: MediaQueryList): void
  {
    // Nothing to do.
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  simpleFilter(tableCell: HTMLTableCellElement): boolean
  {
    return true;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  public startFilter(): boolean
  {
    return false;
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
OverviewTable.registerTableColumn('none', NoneTableColumn);

// Plaisio\Console\Helper\TypeScript\TypeScriptMarkHelper::md5: b604aea25d1aebb67c76fb4e6a2dfcce
