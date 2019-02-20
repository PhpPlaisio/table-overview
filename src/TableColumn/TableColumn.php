<?php
declare(strict_types=1);

namespace SetBased\Abc\Table\TableColumn;

/**
 * Abstract parent class for generating HTML code for table cells in an overview table.
 */
abstract class TableColumn extends BaseTableColumn
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns HTML code (including opening and closing td tags) for the table cell.
   *
   * @param array $row The data of a row in the overview table.
   *
   * @return string
   */
  abstract public function getHtmlCell(array $row): string;

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
