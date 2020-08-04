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
  public compareSortKeys(value1: string, value2: string): number
  {
    const val1: number = (value1 === '') ? NaN : parseFloat(value1);
    const val2: number = (value2 === '') ? NaN : parseFloat(value2);

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
  public getSortKey(tableCell: HTMLTableCellElement): string
  {
    const regexp = /[\d.,\-+]*/;
    const parts  = regexp.exec($(tableCell).text());

    if (parts === null)
    {
      return $(tableCell).text();
    }

    // todo Better internationalisation.
    return parts[0].replace('.', '').replace(',', '.');
  };

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
OverviewTable.registerTableColumn('numeric', NumericTableColumn);
