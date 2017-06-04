<?php
//----------------------------------------------------------------------------------------------------------------------
use SetBased\Abc\Table\TableColumn\MultiEmailTableColumn;

//----------------------------------------------------------------------------------------------------------------------
class MultiEmailTableColumnTest extends PHPUnit_Framework_TestCase
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test the col element.
   */
  public function testColElement()
  {
    $column = new MultiEmailTableColumn('header', 'mail');
    $col    = $column->getHtmlCol();

    $this->assertEquals('<col data-type="email"/>', $col);
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

    $this->assertEquals('<td></td>', $ret);
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

    $this->assertEquals('<td class="email"><a href="mailto:info@setbased.nl">info@setbased.nl</a><br/>'.
                        '<a href="mailto:webmaster@setbased.nl">webmaster@setbased.nl</a></td>', $ret);
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
