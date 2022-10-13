import {OverviewTable} from 'Plaisio/Table/OverviewTable';
import {TextTableColumn} from 'Plaisio/Table/TableColumn/TextTableColumn';

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

// Plaisio\Console\Helper\TypeScript\TypeScriptMarkHelper::md5: 2dbee8595da78c1bcad274105b7a466c
