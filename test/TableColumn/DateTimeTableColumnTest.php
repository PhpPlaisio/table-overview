<?php
declare(strict_types=1);

namespace Plaisio\Table\Test\TableColumn;

use PHPUnit\Framework\TestCase;
use Plaisio\Helper\RenderWalker;
use Plaisio\Table\TableColumn\DateTimeTableColumn;

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
    $walker = new RenderWalker('ot');
    $row    = ['date' => '2004-07-13 12:13:14'];  // PHP 5.0.0 release date and some random time.
    $ret    = $column->htmlCell($walker, $row);

    self::assertEquals('<td class="ot-cell ot-cell-datetime" data-value="2004-07-13 12:13:14">Tuesday 13th of July 2004 12:13:14 PM</td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with an invalid datetime.
   */
  public function test2(): void
  {
    $column = new DateTimeTableColumn('header', 'date');
    $walker = new RenderWalker('ot');
    $row    = ['date' => 'not a date and time'];
    $ret    = $column->htmlCell($walker, $row);

    self::assertEquals('<td class="ot-cell ot-cell-datetime">not a date and time</td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with an empty datetime
   */
  public function test3(): void
  {
    $column = new DateTimeTableColumn('header', 'date');
    $walker = new RenderWalker('ot');
    $row    = ['date' => ''];
    $ret    = $column->htmlCell($walker, $row);

    self::assertEquals('<td class="ot-cell ot-cell-datetime"></td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test the col element.
   */
  public function testColElement(): void
  {
    $column = new DateTimeTableColumn('header', 'date');
    $col    = $column->htmlCol();

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
