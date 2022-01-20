<?php
declare(strict_types=1);

namespace Plaisio\Table\Test;

use PHPUnit\Framework\TestCase;
use Plaisio\Table\OverviewTable;
use Plaisio\Table\TableColumn\TextTableColumn;

/**
 * Test cases for class OverviewTable.
 */
class OverviewTableTest extends TestCase
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritdoc
   */
  public function setUp(): void
  {
    OverviewTable::$responsiveMediaQuery = null;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Simple test for class OverviewTable.
   */
  public function testOverviewTable(): void
  {
    $rows = [['my-field' => 'Hello, world!']];

    $table = new OverviewTable();
    $table->addColumn(new TextTableColumn('Test', 'my-field'));
    $html = $table->htmlTable($rows);

    self::assertSame('<table class="ot-table" data-overview-table="ot">'.
                     '<colgroup><col data-type="text"/></colgroup>'.
                     '<thead class="ot-thead">'.
                     '<tr class="ot-header-row"><th class="is-sortable ot-header">Test</th></tr>'.
                     '</thead>'.
                     '<tbody class="ot-tbody">'.
                     '<tr class="is-even ot-row"><td class="ot-cell ot-text">Hello, world!</td></tr>'.
                     '</tbody>'.
                     '</table>', $html);
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
