import {Cast} from '../../Helper/Cast';
import {OverviewTable} from '../OverviewTable';
import {TextTableColumn} from './TextTableColumn';

/**
 * Table column for integers and floats.
 */
export class NumericTableColumn extends TextTableColumn
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  public compareSortKeys(value1: any, value2: any): number
  {
    const val1: number = (typeof value1 === 'number') ? value1 : NaN;
    const val2: number = (typeof value2 === 'number') ? value2 : NaN;

    if (val1 === val2)
    {
      return 0;
    }

    if (isNaN(val1) && !isNaN(val2))
    {
      return -1;
    }

    if (isNaN(val2) && !isNaN(val1))
    {
      return 1;
    }

    return val1 - val2;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  public getSortKey(tableCell: HTMLTableCellElement): any
  {
    const value: any = $(tableCell).attr('data-value') || $(tableCell).text();

    return Cast.isManFloat(value) ? parseFloat(value) : null;
  };

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
OverviewTable.registerTableColumn('numeric', NumericTableColumn);
