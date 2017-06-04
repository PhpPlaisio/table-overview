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
   * The attributes of the second col element of this table column.
   *
   * @var ColElement
   */
  protected $col2;

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
   * @var int|null
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
   * Object constructor.
   *
   * @param string $dataType1 The data type of the first column.
   * @param string $dataType2 The data type of the second column.
   */
  public function __construct($dataType1, $dataType2)
  {
    parent::__construct($dataType1);

    $this->col2 = new ColElement();
    $this->col2->setAttrData('type', $dataType2);
  }

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
   * Returns HTML code for the col elements for this table columns.
   *
   * @return string
   */
  public function getHtmlCol()
  {
    return parent::getHtmlCol().$this->col2->getHtmlCol();
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
    $attributes = [];
    $classes    = [];

    // Add class indicating this column can be used for sorting.
    if ($this->sortable)
    {
      $classes[] = 'sort-1';

      // Add attributes indicating the sort order of this column and direction.
      if ($this->sortOrder!==null)
      {
        $attributes['data-sort-order-1'] = $this->sortOrder;

        $classes[] = ($this->sortDirection=='desc') ? 'sorted-1-desc' : 'sorted-1-asc';
      }
    }

    // Add class indicating this column can be used for sorting.
    if ($this->sortable2)
    {
      $classes[] = 'sort-2';

      // Add attributes indicating the sort order of this column and direction.
      if ($this->sortOrder2!==null)
      {
        $attributes['data-sort-order-2'] = $this->sortOrder2;

        $classes[] = ($this->sortDirection2=='desc') ? 'sorted-2-desc' : 'sorted-2-asc';
      }
    }

    $header_text = (is_int($this->headerText)) ? Babel::getWord($this->headerText) : $this->headerText;

    $attributes['class']   = implode(' ', $classes);
    $attributes['colspan'] = 2;

    return Html::generateElement('th', $attributes, '<span>&nbsp;</span>'.Html::txt2Html($header_text), true);
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
