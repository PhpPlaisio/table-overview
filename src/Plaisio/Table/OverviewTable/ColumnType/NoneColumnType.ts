import {OverviewTable} from "../OverviewTable";
import {ColumnType} from "./ColumnType";

/**
 * Column type for columns that don't require filtering and sorting.
 */
export class NoneColumnType implements ColumnType
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
/**
 * Register column type handler.
 */
OverviewTable.registerColumnTypeHandler('none', NoneColumnType);
