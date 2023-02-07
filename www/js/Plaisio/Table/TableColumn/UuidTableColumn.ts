import {OverviewTable} from 'Plaisio/Table/OverviewTable';
import {TextTableColumn} from 'Plaisio/Table/TableColumn/TextTableColumn';

/**
 * Table column for UUID.
 */
export class UuidTableColumn extends TextTableColumn
{
  // Nothing to do.
}

//----------------------------------------------------------------------------------------------------------------------
OverviewTable.registerTableColumn('uuid', UuidTableColumn);

// Plaisio\Console\TypeScript\Helper\MarkHelper::md5: db72c74402835835dc43530d6eb85c45
