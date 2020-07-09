import {OverviewTable} from "../OverviewTable";
import {TextColumnType} from "./TextColumnType";

/**
 * Column type for date and datetime.
 */
export class DateTimeColumnType extends TextColumnType
{
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
 * Register column type handlers.
 */
OverviewTable.registerColumnTypeHandler('date', DateTimeColumnType);
OverviewTable.registerColumnTypeHandler('datetime', DateTimeColumnType);
