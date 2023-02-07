import {OverviewTable} from 'Plaisio/Table/OverviewTable';
import {TextTableColumn} from 'Plaisio/Table/TableColumn/TextTableColumn';

/**
 * Table column for boolean.
 */
export class BoolTableColumn extends TextTableColumn
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  public extractForFilter(tableCell: HTMLTableCellElement): string
  {
    return $(tableCell).attr('data-value') || '';
  }

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
OverviewTable.registerTableColumn('bool', BoolTableColumn);

// Plaisio\Console\Helper\TypeScript\TypeScriptMarkHelper::md5: 93a450393331c4aa3b5c00f728d223b7
// Plaisio\Console\TypeScript\Helper\MarkHelper::md5: c172e0c8ed561a527f9ce1f1a1f942c9
