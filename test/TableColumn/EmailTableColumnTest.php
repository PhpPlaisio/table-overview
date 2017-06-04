<?php
//----------------------------------------------------------------------------------------------------------------------
namespace SetBased\Abc\Table\Test\TableColumn;

use PHPUnit\Framework\TestCase;
use SetBased\Abc\Table\TableColumn\EmailTableColumn;

//----------------------------------------------------------------------------------------------------------------------
/**
 * Test cases for class EmailTableColumn.
 */
class EmailTableColumnTest extends TestCase
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test the col element.
   */
  public function testColElement()
  {
    $column = new EmailTableColumn('header', 'date');
    $col    = $column->getHtmlCol();

    self::assertEquals('<col data-type="email"/>', $col);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with an empty email address.
   */
  public function testEmptyAddress()
  {
    $column = new EmailTableColumn('header', 'mail');
    $row    = ['mail' => ''];
    $ret    = $column->getHtmlCell($row);

    self::assertEquals('<td></td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with a valid email address.
   */
  public function testValidAddress1()
  {
    $column = new EmailTableColumn('header', 'mail');
    $row    = ['mail' => 'info@setbased.nl'];
    $ret    = $column->getHtmlCell($row);

    self::assertEquals('<td class="email"><a href="mailto:info@setbased.nl">info@setbased.nl</a></td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
