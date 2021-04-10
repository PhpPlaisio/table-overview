<?php
declare(strict_types=1);

namespace Plaisio\Table\Test\TableColumn;

use PHPUnit\Framework\TestCase;
use Plaisio\Helper\RenderWalker;
use Plaisio\Table\TableColumn\NumberTableColumn;

/**
 * Test cases for class NumberTableColumn.
 */
class NumberTableColumnTest extends TestCase
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test the col element.
   */
  public function testColElement(): void
  {
    $column = new NumberTableColumn('header', 'number');
    $col    = $column->getHtmlCol();

    self::assertEquals('<col data-type="number"/>', $col);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with empty values.
   */
  public function testEmptyValue01(): void
  {
    $column = new NumberTableColumn('header', 'number');

    $values = [null, ''];
    $walker = new RenderWalker('ot');
    foreach ($values as $value)
    {
      $row = ['number' => $value];
      $ret = $column->getHtmlCell($walker, $row);

      self::assertSame('<td class="ot ot-cell ot-number"></td>', $ret, var_export($value, true));
    }
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test data type.
   */
  public function testGetDataType(): void
  {
    $column   = new NumberTableColumn('header', 'number');
    $dataType = $column->getDataType();

    self::assertEquals('number', $dataType);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with a none number value with HTML entities.
   */
  public function testHtmlEntitiesFormat(): void
  {
    // Actually, NumberTableColumn should not be used with a format specifier like this.
    $column = new NumberTableColumn('header', 'number', "&<'\"%s\"'>&");
    $walker = new RenderWalker('ot');
    $row    = ['number' => 1234];
    $ret    = $column->getHtmlCell($walker, $row);

    self::assertSame('<td class="ot ot-cell ot-number" data-value="1234">&amp;&lt;&#039;&quot;1234&quot;&#039;&gt;&amp;</td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with a none number value.
   */
  public function testInvalidValue01(): void
  {
    $column = new NumberTableColumn('header', 'number', '%.2f');
    $walker = new RenderWalker('ot');
    $row    = ['number' => 'qwerty'];
    $ret    = $column->getHtmlCell($walker, $row);

    self::assertSame('<td class="ot ot-cell ot-number">qwerty</td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with a none number value with HTML entities.
   */
  public function testInvalidValue02(): void
  {
    $column = new NumberTableColumn('header', 'number', '%.2f');
    $walker = new RenderWalker('ot');
    $row    = ['number' => "<'\">& "];
    $ret    = $column->getHtmlCell($walker, $row);

    self::assertSame('<td class="ot ot-cell ot-number">&lt;&#039;&quot;&gt;&amp; </td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with a integer.
   */
  public function testNumberValue01(): void
  {
    $column = new NumberTableColumn('header', 'number');
    $walker = new RenderWalker('ot');
    $row    = ['number' => 123];
    $ret    = $column->getHtmlCell($walker, $row);

    self::assertSame('<td class="ot ot-cell ot-number" data-value="123">123</td>', $ret);
  }
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with a float.
   */
  public function testNumberValue02(): void
  {
    $column = new NumberTableColumn('header', 'number', '%.2f');
    $walker = new RenderWalker('ot');
    $row    = ['number' => M_PI];
    $ret    = $column->getHtmlCell($walker, $row);

    self::assertSame('<td class="ot ot-cell ot-number" data-value="3.1415926535898">3.14</td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with a float.
   */
  public function testNumberValue03(): void
  {
    $column = new NumberTableColumn('header', 'number', '%.2f');
    $walker = new RenderWalker('ot');
    $row    = ['number' => 1.005];
    $ret    = $column->getHtmlCell($walker, $row);

    // sprintf does not do any rounding!
    self::assertSame('<td class="ot ot-cell ot-number" data-value="1.005">1.00</td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with zero values.
   */
  public function testZeroValues01(): void
  {
    $column = new NumberTableColumn('header', 'number');

    $values = ['0', 0, 0.0];
    $walker = new RenderWalker('ot');
    foreach ($values as $value)
    {
      $row = ['number' => $value];
      $ret = $column->getHtmlCell($walker, $row);

      self::assertSame('<td class="ot ot-cell ot-number" data-value="0">0</td>', $ret, var_export($value, true));
    }
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with zero values.
   */
  public function testZeroValues02(): void
  {
    $column = new NumberTableColumn('header', 'number', '%.2f');

    $values = ['0', 0, 0.0];
    $walker = new RenderWalker('ot');
    foreach ($values as $value)
    {
      $row = ['number' => $value];
      $ret = $column->getHtmlCell($walker, $row);

      self::assertSame('<td class="ot ot-cell ot-number" data-value="0">0.00</td>', $ret, var_export($value, true));
    }
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
