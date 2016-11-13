<?php
//----------------------------------------------------------------------------------------------------------------------
namespace SetBased\Abc\Table\TableColumn;

use SetBased\Abc\Babel;
use SetBased\Abc\Helper\Html;

//----------------------------------------------------------------------------------------------------------------------
/**
 * Abstract class for classes for generating HTML code for two columns in an overview table with a single header.
 */
abstract class DualTableColumn extends TableColumn
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * The type of the data that second column holds.
   *
   * @var string
   */
  protected $dataType2;

  /**
   * The sort direction of the data in the second column.
   *
   * @var string|null
   */
  protected $sortDirection2;

  /**
   * If set the data in the table of the second column is sorted or must be sorted by this column (and possible by other
   * columns) and its value determines the order in which the data of the table is sorted.
   *
   * @var int
   */
  protected $sortOrder2;

  /**
   * If set second column can be used for sorting the data in the table of this column.
   *
   * @var bool
   */
  protected $sortable2 = true;

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the number of columns spanned, i.e. 2.
   *
   * @return int
   */
  public function getColSpan()
  {
    return 2;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns HTML code for col element for this table columns.
   *
   * @return string
   */
  public function getHtmlColumn()
  {
    $html = Html::generateVoidElement('col', ['data-type' => $this->dataType]);
    $html .= Html::generateVoidElement('col', ['data-type' => $this->dataType2]);

    return $html;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns HTML code (including opening and closing @a th tags) for filtering this table columns.
   *
   * @return string
   */
  public function getHtmlColumnFilter()
  {
    $ret = '<td><input type="text"/></td>';
    $ret .= '<td><input type="text"/></td>';

    return $ret;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns HTML code (including opening and closing th tags) for the header of this table columns.
   *
   * @return string
   */
  public function getHtmlColumnHeader()
  {
    $class = '';

    // Add class indicating this column can be used for sorting.
    if ($this->sortable)
    {
      if ($class) $class .= ' ';
      $class .= 'sort-1';
    }

    // Add class indicating the sort order of this column.
    if ($this->sortable && $this->sortDirection)
    {
      if ($class) $class .= ' ';

      // Add class indicating this column can be used for sorting.
      $class .= 'sort-order-1-';
      $class .= $this->sortOrder;

      $class .= ($this->sortDirection=='desc') ? ' sorted-1-desc' : ' sorted-1-asc';
    }

    // Add class indicating this column can be used for sorting.
    if ($this->sortable2)
    {
      if ($class) $class .= ' ';
      $class .= 'sort-2';

      // Add class indicating the sort order of this column.
      if ($this->sortOrder2)
      {
        if ($class) $class .= ' ';

        // Add class indicating this column can be used for sorting.
        $class .= 'sort-order-2-';
        $class .= $this->sortOrder2;

        $class .= ($this->sortDirection2=='desc') ? ' sorted-2-desc' : ' sorted-2-asc';
      }
    }

    $header_text = (is_int($this->headerText)) ? Babel::getWord($this->headerText) : $this->headerText;

    return '<th colspan="2" class="'.$class.'"><span>&nbsp;</span>'.Html::txt2Html($header_text).'</th>';
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Sets the first and the second column as not sortable (overriding the default behaviour a child class).
   */
  public function notSortable()
  {
    $this->sortable  = false;
    $this->sortable2 = false;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Sets the first column as not sortable (overriding the default behaviour a child class).
   */
  public function notSortable1()
  {
    $this->sortable = false;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Sets the second column as not sortable (overriding the default behaviour a child class).
   */
  public function notSortable2()
  {
    $this->sortable2 = false;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Sets the sorting order of the first table column.
   *
   * @param int  $sortOrder      The sorting order.
   * @param bool $descendingFlag If set the data is sorted descending, otherwise ascending.
   */
  public function sortOrder1($sortOrder, $descendingFlag = false)
  {
    $this->sortDirection = ($descendingFlag) ? 'desc' : 'asc';
    $this->sortOrder     = $sortOrder;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Sets the sorting order of second table column.
   *
   * @param int  $sortOrder      The sorting order.
   * @param bool $descendingFlag If set the data is sorted descending, otherwise ascending.
   */
  public function sortOrder2($sortOrder, $descendingFlag = false)
  {
    $this->sortDirection2 = ($descendingFlag) ? 'desc' : 'asc';
    $this->sortOrder2     = $sortOrder;
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
