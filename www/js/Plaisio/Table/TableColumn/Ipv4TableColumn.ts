import {Cast} from '../../Helper/Cast';
import {OverviewTable} from '../OverviewTable';
import {NumericTableColumn} from './NumericTableColumn';

/**
 * Table column for IPv4 addresses.
 */
export class Ipv4TableColumn extends NumericTableColumn
{
  // Nothing to implement.
}

//----------------------------------------------------------------------------------------------------------------------
OverviewTable.registerTableColumn('ipv4', Ipv4TableColumn);
