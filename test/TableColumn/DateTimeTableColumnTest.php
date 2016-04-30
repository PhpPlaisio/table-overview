<?php
//----------------------------------------------------------------------------------------------------------------------
use SetBased\Abc\Table\TableColumn\DateTimeTableColumn;

//----------------------------------------------------------------------------------------------------------------------
class DateTimeTableColumnTest extends PHPUnit_Framework_TestCase
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with a valid datetime.
   */
  public function test1()
  {
    $column = new DateTimeTableColumn('header', 'date', 'l jS \of F Y h:i:s A');
    $row    = ['date' => '2004-07-13 12:13:14'];  // PHP 5.0.0 release date and some random time.
    $ret    = $column->getHtmlCell($row);

    $this->assertEquals('<td class="datetime" data-value="2004-07-13 12:13:14">Tuesday 13th of July 2004 12:13:14 PM</td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with an invalid datetime.
   */
  public function test2()
  {
    $column = new DateTimeTableColumn('header', 'date');
    $row    = ['date' => 'not a date and time'];
    $ret    = $column->getHtmlCell($row);

    $this->assertEquals('<td>not a date and time</td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with an empty datetime
   */
  public function test3()
  {
    $column = new DateTimeTableColumn('header', 'date');
    $row    = ['date' => ''];
    $ret    = $column->getHtmlCell($row);

    $this->assertEquals('<td class="datetime"></td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
