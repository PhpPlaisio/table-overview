<?php
declare(strict_types=1);

namespace Plaisio\Table\Test\TableColumn;

use PHPUnit\Framework\TestCase;
use Plaisio\Table\TableColumn\NumericTableColumn;

/**
 * Test cases for class NumericTableColumn.
 */
class NumericTableColumnTest extends TestCase
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test the col element.
   */
  public function testColElement(): void
  {
    $column = new NumericTableColumn('header', 'number');
    $col    = $column->getHtmlCol();

    self::assertEquals('<col data-type="numeric"/>', $col);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with empty values.
   */
  public function testEmptyValue01(): void
  {
    $column = new NumericTableColumn('header', 'number');

    $values = [null, false, ''];
    foreach ($values as $value)
    {
      $row = ['number' => $value];
      $ret = $column->getHtmlCell($row);

      self::assertSame('<td></td>', $ret, var_export($value, true));
    }
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test data type.
   */
  public function testGetDataType(): void
  {
    $column   = new NumericTableColumn('header', 'number');
    $dataType = $column->getDataType();

    self::assertEquals('numeric', $dataType);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with a none numeric value with HTML entities.
   */
  public function testHtmlEntitiesFormat(): void
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
  public function testInvalidValue01(): void
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
  public function testInvalidValue02(): void
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
  public function testNumericValue01(): void
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
  public function testNumericValue02(): void
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
  public function testNumericValue03(): void
  {
    $column = new NumericTableColumn('header', 'number', '%.2f');
    $row    = ['number' => 1.005];
    $ret    = $column->getHtmlCell($row);

    // sprintf does not do any rounding!
    self::assertSame('<td class="number">1.00</td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with zero values.
   */
  public function testZeroValues01(): void
  {
    $column = new NumericTableColumn('header', 'number');

    $values = ['0', 0, 0.0];
    foreach ($values as $value)
    {
      $row = ['number' => $value];
      $ret = $column->getHtmlCell($row);

      self::assertSame('<td class="number">0</td>', $ret, var_export($value, true));
    }
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with zero values.
   */
  public function testZeroValues02(): void
  {
    $column = new NumericTableColumn('header', 'number', '%.2f');

    $values = ['0', 0, 0.0];
    foreach ($values as $value)
    {
      $row = ['number' => $value];
      $ret = $column->getHtmlCell($row);

      self::assertSame('<td class="number">0.00</td>', $ret, var_export($value, true));
    }
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
