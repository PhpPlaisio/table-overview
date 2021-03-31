<?php
declare(strict_types=1);

namespace Plaisio\Table\TableRow;

use Plaisio\Helper\RenderWalker;

/**
 * Helper class for generating zebra themed table rows.
 */
class ZebraTableRow implements TableRow
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritdoc
   */
  public function getRowAttributes(RenderWalker $walker, int $index, array $row): array
  {
    return ['class' => $walker->getClasses('row', ($index % 2===0) ? 'is-even' : 'is-odd')];
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
