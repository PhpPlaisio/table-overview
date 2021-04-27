import {OverviewTable} from '../OverviewTable';
import {NumberTableColumn} from './NumberTableColumn';

/**
 * Table column for IPv4 and IPv6 addresses.
 */
export class IpTableColumn extends NumberTableColumn
{
  // Nothing to implement.
}

//----------------------------------------------------------------------------------------------------------------------
OverviewTable.registerTableColumn('ip', IpTableColumn);
OverviewTable.registerTableColumn('ipv4', IpTableColumn);

// Plaisio\Console\Helper\TypeScript\TypeScriptMarkHelper::md5: 5091fbb445303c3af6653bcbea4134b3
