import {OverviewTable} from "../OverviewTable";
import {TextTableColumn} from "./TextTableColumn";

/**
 * Table column for IPv4 addresses.
 */
export class Ipv4TableColumn extends TextTableColumn
{
  // Nothing to implement.
}

//----------------------------------------------------------------------------------------------------------------------
OverviewTable.registerTableColumn('ip4', Ipv4TableColumn);
