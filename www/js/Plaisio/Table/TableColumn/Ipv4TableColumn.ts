import {OverviewTable} from '../OverviewTable';
import {NumberTableColumn} from './NumberTableColumn';

/**
 * Table column for IPv4 addresses.
 */
export class Ipv4TableColumn extends NumberTableColumn
{
  // Nothing to implement.
}

//----------------------------------------------------------------------------------------------------------------------
OverviewTable.registerTableColumn('ipv4', Ipv4TableColumn);

// Plaisio\Console\Helper\TypeScript\TypeScriptMarkHelper::md5: ab2cb81073e80bc978cd3c4dfe889691
