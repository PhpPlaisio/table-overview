import {OverviewTable} from "../OverviewTable";
import {TextColumnType} from "./TextColumnType";

/**
 * Column type for boolean.
 */
export class BoolColumnType extends TextColumnType
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  public extractForFilter(tableCell: HTMLTableCellElement): string
  {
    return $(tableCell).attr('data-value');
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  public getSortKey(tableCell): string
  {
    return $(tableCell).attr('data-value');
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
/**
 * Register column type handler.
 */
OverviewTable.registerColumnTypeHandler('bool', BoolColumnType);
