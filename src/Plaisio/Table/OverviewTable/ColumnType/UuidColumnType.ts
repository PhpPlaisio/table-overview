import {OverviewTable} from "../OverviewTable";
import {TextColumnType} from "./TextColumnType";

/**
 * Column type for UUID.
 */
export class UuidColumnType extends TextColumnType
{
  // Nothing to do.
}

//----------------------------------------------------------------------------------------------------------------------
/**
 * Register column type handlers.
 */
OverviewTable.registerColumnTypeHandler('uuid', UuidColumnType);
