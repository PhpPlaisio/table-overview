import {OverviewTable} from 'Plaisio/Table/OverviewTable';
import {TextTableColumn} from 'Plaisio/Table/TableColumn/TextTableColumn';

/**
 * Table column for IPv4 and IPv6 addresses.
 */
export class IpTableColumn extends TextTableColumn
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  public getSortKey(tableCell: HTMLTableCellElement): any
  {
    return $(tableCell).attr('data-value') || $(tableCell).text();
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
OverviewTable.registerTableColumn('ip', IpTableColumn);

// Plaisio\Console\TypeScript\Helper\MarkHelper::md5: 4a219ae36c6ae13ea372177bd2ca5f7e
