<?php
declare(strict_types=1);

namespace SetBased\Abc\Table\Test\TableColumn;

use PHPUnit\Framework\TestCase;
use SetBased\Abc\Table\TableColumn\DateTimeTableColumn;

/**
 * Test cases for class DateTimeTableColumn.
 */
class DateTimeTableColumnTest extends TestCase
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with a valid datetime.
   */
  public function test1(): void
  {
    $column = new DateTimeTableColumn('header', 'date', 'l jS \of F Y h:i:s A');
    $row    = ['date' => '2004-07-13 12:13:14'];  // PHP 5.0.0 release date and some random time.
    $ret    = $column->getHtmlCell($row);

    self::assertEquals('<td class="datetime" data-value="2004-07-13 12:13:14">Tuesday 13th of July 2004 12:13:14 PM</td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with an invalid datetime.
   */
  public function test2(): void
  {
    $column = new DateTimeTableColumn('header', 'date');
    $row    = ['date' => 'not a date and time'];
    $ret    = $column->getHtmlCell($row);

    self::assertEquals('<td>not a date and time</td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with an empty datetime
   */
  public function test3(): void
  {
    $column = new DateTimeTableColumn('header', 'date');
    $row    = ['date' => ''];
    $ret    = $column->getHtmlCell($row);

    self::assertEquals('<td class="datetime"></td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test the col element.
   */
  public function testColElement(): void
  {
    $column = new DateTimeTableColumn('header', 'date');
    $col    = $column->getHtmlCol();

    self::assertEquals('<col data-type="datetime"/>', $col);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test data type.
   */
  public function testGetDataType(): void
  {
    $column   = new DateTimeTableColumn('header', 'date');
    $dataType = $column->getDataType();

    self::assertEquals('datetime', $dataType);
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
