import {Cast} from 'Plaisio/Helper/Cast';
import {OverviewTable} from 'Plaisio/Table/OverviewTable';
import {TextTableColumn} from 'Plaisio/Table/TableColumn/TextTableColumn';

/**
 * Table column for integers and floats.
 */
export class NumberTableColumn extends TextTableColumn
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
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
OverviewTable.registerTableColumn('number', NumberTableColumn);

// Plaisio\Console\Helper\TypeScript\TypeScriptMarkHelper::md5: f04d8147d95d8ce9bc115256002e103e
