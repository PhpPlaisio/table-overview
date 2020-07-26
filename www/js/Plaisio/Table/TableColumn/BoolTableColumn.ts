import {OverviewTable} from '../OverviewTable';
import {TextTableColumn} from './TextTableColumn';

/**
 * Table column for boolean.
 */
export class BoolTableColumn extends TextTableColumn
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  public extractForFilter(tableCell: HTMLTableCellElement): string
  {
    return $(tableCell).attr('data-value') || '';
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  public getSortKey(tableCell: HTMLTableCellElement): string
  {
    return $(tableCell).attr('data-value') || '';
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
OverviewTable.registerTableColumn('bool', BoolTableColumn);
