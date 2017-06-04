<?php
//----------------------------------------------------------------------------------------------------------------------
namespace SetBased\Abc\Table\Test\TableColumn;

use PHPUnit\Framework\TestCase;
use SetBased\Abc\Table\TableColumn\NumericTableColumn;

//----------------------------------------------------------------------------------------------------------------------
/**
 * Test cases for class NumericTableColumn.
 */
class NumericTableColumnTest extends TestCase
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test the col element.
   */
  public function testColElement()
  {
    $column = new NumericTableColumn('header', 'number');
    $col    = $column->getHtmlCol();

    self::assertEquals('<col data-type="numeric"/>', $col);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with an empty value.
   */
  public function testEmptyValue01()
  {
    $column = new NumericTableColumn('header', 'number');
    $row    = ['number' => ''];
    $ret    = $column->getHtmlCell($row);

    self::assertSame('<td></td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with an empty value.
   */
  public function testEmptyValue02()
  {
    $column = new NumericTableColumn('header', 'number');
    $row    = ['number' => null];
    $ret    = $column->getHtmlCell($row);

    self::assertSame('<td></td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with a none numeric value with HTML entities.
   */
  public function testHtmlEntitiesFormat()
  {
    // Actually, NumericTableColumn should not be used with a format specifier like this.
    $column = new NumericTableColumn('header', 'number', "&<'\"%s\"'>&");
    $row    = ['number' => 1234];
    $ret    = $column->getHtmlCell($row);

    self::assertSame('<td class="number">&amp;&lt;&#039;&quot;1234&quot;&#039;&gt;&amp;</td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with a none numeric value.
   */
  public function testInvalidValue01()
  {
    $column = new NumericTableColumn('header', 'number', '%.2f');
    $row    = ['number' => 'qwerty'];
    $ret    = $column->getHtmlCell($row);

    self::assertSame('<td>qwerty</td>', $ret);
  }
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with a none numeric value with HTML entities.
   */
  public function testInvalidValue02()
  {
    $column = new NumericTableColumn('header', 'number', '%.2f');
    $row    = ['number' => "<'\">& "];
    $ret    = $column->getHtmlCell($row);

    self::assertSame('<td>&lt;&#039;&quot;&gt;&amp; </td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with a integer.
   */
  public function testNumericValue01()
  {
    $column = new NumericTableColumn('header', 'number');
    $row    = ['number' => 123];
    $ret    = $column->getHtmlCell($row);

    self::assertSame('<td class="number">123</td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with a float.
   */
  public function testNumericValue02()
  {
    $column = new NumericTableColumn('header', 'number', '%.2f');
    $row    = ['number' => M_PI];
    $ret    = $column->getHtmlCell($row);

    self::assertSame('<td class="number">3.14</td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with a float.
   */
  public function testNumericValue03()
  {
    $column = new NumericTableColumn('header', 'number', '%.2f');
    $row    = ['number' => 1.005];
    $ret    = $column->getHtmlCell($row);

    // sprintf does not do any rounding!
    self::assertSame('<td class="number">1.00</td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
