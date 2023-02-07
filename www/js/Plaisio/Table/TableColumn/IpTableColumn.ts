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

// Plaisio\Console\Helper\TypeScript\TypeScriptMarkHelper::md5: b125bf4ed80ece8baa72aff76b914897
