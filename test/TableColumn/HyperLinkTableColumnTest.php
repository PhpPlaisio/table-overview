<?php
declare(strict_types=1);

namespace Plaisio\Table\Test\TableColumn;

use PHPUnit\Framework\TestCase;
use Plaisio\Helper\RenderWalker;
use Plaisio\Table\TableColumn\HyperLinkTableColumn;

/**
 * Test cases for class HyperLinkTableColumn.
 */
class HyperLinkTableColumnTest extends TestCase
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test the col element.
   */
  public function testColElement(): void
  {
    $column = new HyperLinkTableColumn('header', 'url');
    $col    = $column->htmlCol();

    self::assertEquals('<col data-type="text"/>', $col);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with an empty hyperlink.
   */
  public function testEmptyAddress(): void
  {
    $column = new HyperLinkTableColumn('header', 'url');
    $walker = new RenderWalker('ot');

    $row = ['url' => ''];
    $ret = $column->htmlCell($walker, $row);
    self::assertEquals('<td class="ot-cell ot-link"></td>', $ret);

    $row = ['url' => null];
    $ret = $column->htmlCell($walker, $row);
    self::assertEquals('<td class="ot-cell ot-link"></td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with a valid email address.
   */
  public function testValidAddress1(): void
  {
    $column = new HyperLinkTableColumn('header', 'url');
    $walker = new RenderWalker('ot');
    $row    = ['url' => 'https://www.setbased.nl'];
    $ret    = $column->htmlCell($walker, $row);

    self::assertEquals('<td class="ot-cell ot-link">'.
                       '<a class="link" href="https://www.setbased.nl">https://www.setbased.nl</a>'.
                       '</td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
