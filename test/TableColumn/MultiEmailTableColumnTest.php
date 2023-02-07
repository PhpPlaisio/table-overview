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
    $col    = $column->htmlCol();

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
    $ret    = $column->htmlCell($walker, $row);

    self::assertEquals('<td class="ot-cell ot-cell-emails"></td>', $ret);
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
    $ret    = $column->htmlCell($walker, $row);

    self::assertEquals('<td class="ot-cell ot-cell-emails">'.
                       '<ul class="ot-email-list">'.
                       '<li class="ot-email-list-item"><a class="link link-mailto" href="mailto:info@setbased.nl">info@setbased.nl</a></li>'.
                       '<li class="ot-email-list-item"><a class="link link-mailto" href="mailto:webmaster@setbased.nl">webmaster@setbased.nl</a></li>'.
                       '</ul>'.
                       '</td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
