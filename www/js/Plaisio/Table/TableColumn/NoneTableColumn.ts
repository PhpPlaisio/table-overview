import {OverviewTable} from "../OverviewTable";
import {TableColumn} from "./TableColumn";

/**
 * Table column for columns that don't require filtering and sorting.
 */
export class NoneTableColumn implements TableColumn
{
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
  public startFilter(): boolean
  {
    return false;
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
  getSortKey(tableCell): string
  {
    return '';
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  initFilter(table: OverviewTable, columnIndex: number, mq: MediaQueryList): void
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
}

//----------------------------------------------------------------------------------------------------------------------
OverviewTable.registerTableColumn('none', NoneTableColumn);
