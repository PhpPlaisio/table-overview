<?php
declare(strict_types=1);

namespace Plaisio\Table\Test\TableColumn;

use PHPUnit\Framework\TestCase;
use Plaisio\Helper\RenderWalker;
use Plaisio\Table\TableColumn\CombinedTableColumn;
use Plaisio\Table\TableColumn\DateTableColumn;

/**
 * Test cases for class CombinedTableColumn.
 */
class CombinedTableColumnTest extends TestCase
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test method getHtmlColumnHeader().
   */
  public function testGetHtmlColumnHeader(): void
  {
    $column1 = new DateTableColumn(null, 'psf_date_start');
    $column2 = new DateTableColumn(null, 'psf_date_stop');
    $column  = new CombinedTableColumn('Period', $column1, $column2);
    $walker  = new RenderWalker('ot');

    $header   = $column->getHtmlColumnHeader($walker);
    $expected = '<th class="is-sortable-1 is-sortable-2 ot-header" colspan="2"><span>&nbsp;</span>Period</th>';
    self::assertEquals($expected, $header);

    $column1->setSortOrder(1);
    $header   = $column->getHtmlColumnHeader($walker);
    $expected = '<th class="is-sortable-1 is-sortable-2 is-sorted-1-asc ot-header" colspan="2"><span>&nbsp;</span>Period</th>';
    self::assertEquals($expected, $header);

    $column2->setSortOrder(1);
    $header   = $column->getHtmlColumnHeader($walker);
    $expected = '<th class="is-sortable-1 is-sortable-2 is-sorted-1-asc is-sorted-2-asc ot-header" colspan="2"><span>&nbsp;</span>Period</th>';
    self::assertEquals($expected, $header);

    $column1->setSortable(false);
    $header   = $column->getHtmlColumnHeader($walker);
    $expected = '<th class="is-sortable-2 is-sorted-2-asc ot-header" colspan="2"><span>&nbsp;</span>Period</th>';
    self::assertEquals($expected, $header);

    $column2->setSortable(false);
    $header   = $column->getHtmlColumnHeader($walker);
    $expected = '<th class="ot-header" colspan="2"><span>&nbsp;</span>Period</th>';
    self::assertEquals($expected, $header);
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
