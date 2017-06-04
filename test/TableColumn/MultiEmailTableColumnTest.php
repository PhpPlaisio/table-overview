<?php
//----------------------------------------------------------------------------------------------------------------------
namespace SetBased\Abc\Table\Test\TableColumn;

use PHPUnit\Framework\TestCase;
use SetBased\Abc\Table\TableColumn\MultiEmailTableColumn;

//----------------------------------------------------------------------------------------------------------------------
/**
 * Test cases for class MultiEmailTableColumn.
 */
class MultiEmailTableColumnTest extends TestCase
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test the col element.
   */
  public function testColElement()
  {
    $column = new MultiEmailTableColumn('header', 'mail');
    $col    = $column->getHtmlCol();

    self::assertEquals('<col data-type="email"/>', $col);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with an empty email address.
   */
  public function testEmptyAddress()
  {
    $column = new MultiEmailTableColumn('header', 'mail');
    $row    = ['mail' => ''];
    $ret    = $column->getHtmlCell($row);

    self::assertEquals('<td></td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test data type.
   */
  public function testGetDataType()
  {
    $column   = new MultiEmailTableColumn('header', 'mail');
    $dataType = $column->getDataType();

    self::assertEquals('email', $dataType);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with a valid email addresses.
   */
  public function testValidAddress1()
  {
    $column = new MultiEmailTableColumn('header', 'mail');
    $row    = ['mail' => 'info@setbased.nl,webmaster@setbased.nl'];
    $ret    = $column->getHtmlCell($row);

    self::assertEquals('<td class="email"><a href="mailto:info@setbased.nl">info@setbased.nl</a><br/>'.
                       '<a href="mailto:webmaster@setbased.nl">webmaster@setbased.nl</a></td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
