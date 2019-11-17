<?php
declare(strict_types=1);

namespace Plaisio\Table\Test\TableColumn;

use PHPUnit\Framework\TestCase;
use Plaisio\Table\TableColumn\DateTableColumn;

/**
 * Test cases for class DateTableColumn.
 */
class DateTableColumnTest extends TestCase
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test the col element.
   */
  public function testColElement(): void
  {
    $column = new DateTableColumn('header', 'date');
    $col    = $column->getHtmlCol();

    self::assertEquals('<col data-type="date"/>', $col);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with an empty date.
   */
  public function testEmptyDate1(): void
  {
    $column = new DateTableColumn('header', 'date');
    $row    = ['date' => ''];
    $ret    = $column->getHtmlCell($row);

    self::assertEquals('<td class="date"></td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test data type.
   */
  public function testGetDataType(): void
  {
    $column   = new DateTableColumn('header', 'date');
    $dataType = $column->getDataType();

    self::assertEquals('date', $dataType);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with an invalid date.
   */
  public function testInvalidDate1(): void
  {
    $column = new DateTableColumn('header', 'date');
    $row    = ['date' => 'not a date'];
    $ret    = $column->getHtmlCell($row);

    self::assertEquals('<td>not a date</td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with an open date.
   */
  public function testOpenEndDate1(): void
  {
    $column = new DateTableColumn('header', 'date');
    $row    = ['date' => '9999-12-31'];
    $ret    = $column->getHtmlCell($row);

    self::assertEquals('<td class="date"></td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with an custom open date.
   */
  public function testOpenEndDate2(): void
  {
    DateTableColumn::$openDate = '8888-88-88';

    $column = new DateTableColumn('header', 'date');
    $row    = ['date' => '8888-88-88'];
    $ret    = $column->getHtmlCell($row);

    self::assertEquals('<td class="date"></td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with a valid date.
   */
  public function testValidDate1(): void
  {
    $column = new DateTableColumn('header', 'date', 'l jS \of F Y');
    $row    = ['date' => '2004-07-13'];  // PHP 5.0.0 release date.
    $ret    = $column->getHtmlCell($row);

    self::assertEquals('<td class="date" data-value="2004-07-13">Tuesday 13th of July 2004</td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
