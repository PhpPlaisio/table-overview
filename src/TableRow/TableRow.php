<?php
declare(strict_types=1);

namespace Plaisio\Table\TableRow;

use Plaisio\Helper\RenderWalker;

/**
 * Interface for classes for generating the attributes of table rows.
 */
interface TableRow
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the attributes for a table row.
   *
   * @param RenderWalker $walker The object for walking the row and column tree.
   * @param int          $index  The 0-indexed row index.
   * @param array        $row    The data of a row in the overview table.
   *
   * @return array
   */
  public function getRowAttributes(RenderWalker $walker, int $index, array $row): array;

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
