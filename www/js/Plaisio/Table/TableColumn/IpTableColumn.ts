import {OverviewTable} from '../OverviewTable';
import {TextTableColumn} from './TextTableColumn';

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
OverviewTable.registerTableColumn('ipv4', IpTableColumn);

// Plaisio\Console\Helper\TypeScript\TypeScriptMarkHelper::md5: bef1c36e1509e3ea655fbd242600da23
