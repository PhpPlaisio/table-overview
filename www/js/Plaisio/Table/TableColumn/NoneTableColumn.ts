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
  public mediaChange(): void
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

// Plaisio\Console\TypeScript\Helper\MarkHelper::md5: 4a059b2e0c792947f8517e0b19b251f4
