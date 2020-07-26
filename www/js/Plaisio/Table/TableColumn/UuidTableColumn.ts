import {OverviewTable} from '../OverviewTable';
import {TextTableColumn} from './TextTableColumn';

/**
 * Table column for UUID.
 */
export class UuidTableColumn extends TextTableColumn
{
  // Nothing to do.
}

//----------------------------------------------------------------------------------------------------------------------
OverviewTable.registerTableColumn('uuid', UuidTableColumn);
