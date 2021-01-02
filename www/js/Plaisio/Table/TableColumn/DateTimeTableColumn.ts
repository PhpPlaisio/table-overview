import {OverviewTable} from '../OverviewTable';
import {TextTableColumn} from './TextTableColumn';

/**
 * Table column for date and datetime.
 */
export class DateTimeTableColumn extends TextTableColumn
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  public getSortKey(tableCell: HTMLTableCellElement): any
  {
    return $(tableCell).attr('data-value');
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
OverviewTable.registerTableColumn('date', DateTimeTableColumn);
OverviewTable.registerTableColumn('datetime', DateTimeTableColumn);

// Plaisio\Console\Helper\TypeScript\TypeScriptMarkHelper::md5: 053170adf3010c5d35e6fc31be1e23da
