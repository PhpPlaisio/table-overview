import {OverviewTable} from "../OverviewTable";
import {TextColumnType} from "./TextColumnType";

/**
 * Column type for IPv4 addresses.
 */
export class Ipv4ColumnType extends TextColumnType
{
  // Nothing to implement.
}

//----------------------------------------------------------------------------------------------------------------------
/**
 * Register column type handler.
 */
OverviewTable.registerColumnTypeHandler('ip4', Ipv4ColumnType);
