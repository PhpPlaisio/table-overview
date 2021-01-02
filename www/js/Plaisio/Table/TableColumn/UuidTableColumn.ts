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

// Plaisio\Console\Helper\TypeScript\TypeScriptMarkHelper::md5: 6cb54eff0ca3d155823ca53b75df1018
