<?php
declare(strict_types=1);

namespace Plaisio\Table\Test\TableColumn;

use PHPUnit\Framework\TestCase;
use Plaisio\Helper\RenderWalker;
use Plaisio\Table\TableColumn\MultiEmailTableColumn;

/**
 * Test cases for class MultiEmailTableColumn.
 */
class MultiEmailTableColumnTest extends TestCase
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test the col element.
   */
  public function testColElement(): void
  {
    $column = new MultiEmailTableColumn('header', 'mail');
    $col    = $column->getHtmlCol();

    self::assertEquals('<col data-type="email"/>', $col);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with an empty email address.
   */
  public function testEmptyAddress(): void
  {
    $column = new MultiEmailTableColumn('header', 'mail');
    $walker = new RenderWalker('ot');
    $row    = ['mail' => ''];
    $ret    = $column->getHtmlCell($walker, $row);

    self::assertEquals('<td class="ot ot-cell ot-emails"></td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test data type.
   */
  public function testGetDataType(): void
  {
    $column   = new MultiEmailTableColumn('header', 'mail');
    $dataType = $column->getDataType();

    self::assertEquals('email', $dataType);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with a valid email addresses.
   */
  public function testValidAddress1(): void
  {
    $column = new MultiEmailTableColumn('header', 'mail');
    $walker = new RenderWalker('ot');
    $row    = ['mail' => 'info@setbased.nl,webmaster@setbased.nl'];
    $ret    = $column->getHtmlCell($walker, $row);

    self::assertEquals('<td class="ot ot-cell ot-emails">'.
                       '<span class="ot ot-email-list">'.
                       '<a href="mailto:info@setbased.nl">info@setbased.nl</a>'.
                       '<a href="mailto:webmaster@setbased.nl">webmaster@setbased.nl</a>'.
                       '</span>'.
                       '</td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
