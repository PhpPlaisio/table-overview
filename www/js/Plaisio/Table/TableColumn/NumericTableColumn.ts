import {OverviewTable} from "../OverviewTable";
import {TextTableColumn} from "./TextTableColumn";

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
    let val1: number = (value1 === '' || value1 === null) ? null : parseFloat(value1);
    let val2: number = (value2 === '' || value2 === null) ? null : parseFloat(value2);

    if (val1 === val2)
    {
      return 0;
    }

    if (val1 === null && !isNaN(val2))
    {
      return -1;
    }

    if (val2 === null && !isNaN(val1))
    {
      return 1;
    }

    return val1 - val2;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  public getSortKey(tableCell): string
  {
    let regexp = /[\d.,\-+]*/;
    let parts = regexp.exec($(tableCell).text());

    // todo Better internationalisation.
    return parts[0].replace('.', '').replace(',', '.');
  };

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
OverviewTable.registerTableColumn('numeric', NumericTableColumn);
