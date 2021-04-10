<?php
declare(strict_types=1);

namespace Plaisio\Table\Test\TableColumn;

use PHPUnit\Framework\TestCase;
use Plaisio\Helper\RenderWalker;
use Plaisio\Table\TableColumn\EmailTableColumn;

/**
 * Test cases for class EmailTableColumn.
 */
class EmailTableColumnTest extends TestCase
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test the col element.
   */
  public function testColElement(): void
  {
    $column = new EmailTableColumn('header', 'date');
    $col    = $column->getHtmlCol();

    self::assertEquals('<col data-type="email"/>', $col);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with an empty email address.
   */
  public function testEmptyAddress(): void
  {
    $column = new EmailTableColumn('header', 'mail');
    $walker = new RenderWalker('ot');
    $row    = ['mail' => ''];
    $ret    = $column->getHtmlCell($walker, $row);

    self::assertEquals('<td class="ot ot-cell ot-email"></td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test data type.
   */
  public function testGetDataType(): void
  {
    $column   = new EmailTableColumn('header', 'mail');
    $dataType = $column->getDataType();

    self::assertEquals('email', $dataType);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with a valid email address.
   */
  public function testValidAddress1(): void
  {
    $column = new EmailTableColumn('header', 'mail');
    $walker = new RenderWalker('ot');
    $row    = ['mail' => 'info@setbased.nl'];
    $ret    = $column->getHtmlCell($walker, $row);

    self::assertEquals('<td class="ot ot-cell ot-email">'.
                       '<a href="mailto:info@setbased.nl">info@setbased.nl</a>'.
                       '</td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
