<?php
//----------------------------------------------------------------------------------------------------------------------
use SetBased\Abc\Table\TableColumn\NumericTableColumn;

//----------------------------------------------------------------------------------------------------------------------
class NumericTableColumnTest extends PHPUnit_Framework_TestCase
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with an empty value.
   */
  public function testEmptyValue01()
  {
    $column = new NumericTableColumn('header', 'number');
    $row    = ['number' => ''];
    $ret    = $column->getHtmlCell($row);

    $this->assertSame('<td></td>', $ret);
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

    $this->assertSame('<td></td>', $ret);
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

    $this->assertSame('<td class="number">123</td>', $ret);
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

    $this->assertSame('<td class="number">3.14</td>', $ret);
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
    $this->assertSame('<td class="number">1.00</td>', $ret);
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

    $this->assertSame('<td>qwerty</td>', $ret);
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

    $this->assertSame('<td>&lt;&#039;&quot;&gt;&amp; </td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
