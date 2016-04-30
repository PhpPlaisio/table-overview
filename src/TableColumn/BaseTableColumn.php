<?php
//----------------------------------------------------------------------------------------------------------------------
namespace SetBased\Abc\Table\TableColumn;

use SetBased\Abc\Babel;
use SetBased\Abc\Helper\Html;
use SetBased\Abc\Table\OverviewTable;

//----------------------------------------------------------------------------------------------------------------------
/**
 * Abstract parent class for generating HTML code for table cells in an overview table.
 */
abstract class BaseTableColumn
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * The type of the data that this table column holds.
   *
   * @var string
   */
  protected $dataType;

  /**
   * The header of this column. We distinguish 3 types:
   * <ul>
   * <li>string: the value is the header text of this table column,
   * <li>null: this table column has header without a text and with class 'empty',
   * <li>int: the value is a word ID to be resolved to a text using Babel.
   * </ul>
   *
   * Note: 14 is a word ID and '14' is a header text.
   *
   * @var string|int|null
   */
  protected $headerText;

  /**
   * The sort direction of the data in this column.
   *
   * @var string
   */
  protected $sortDirection;

  /**
   * If set the data in the table of this column is sorted or must be sorted by this column (and possible by other
   * columns) and its value determines the order in which the data of the table is sorted.
   *
   * @var int
   */
  protected $sortOrder;

  /**
   * If set this column can be used for sorting the data in the table of this column.
   *
   * @var bool
   */
  protected $sortable = true;

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the number of columns spanned by this object.
   *
   * @return int
   */
  public function getColSpan()
  {
    return 1;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the data type of this table column.
   *
   * @return string
   */
  public function getDataType()
  {
    return $this->dataType;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns HTML code for col element for this table column.
   *
   * @return string
   */
  public function getHtmlColumn()
  {
    // Add class indicating the type of data of this column.
    if ($this->dataType)
    {
      $class = 'data-type-'.$this->dataType;
    }
    else
    {
      $class = null;
    }

    return '<col'.Html::generateAttribute('class', $class).'/>';
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns HTML code (including opening and closing th tags) for the table filter cell.
   *
   * @return string
   */
  public function getHtmlColumnFilter()
  {
    if ($this->headerText===null)
    {
      // If the column header is empty there is no column filter by default. This behaviour can be overridden in a
      // child class.
      return '<td></td>';
    }
    else
    {
      // The default filter is a simple text filter.
      return '<td><input type="text"/></td>';
    }
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns HTML code (including opening and closing th tags) for the table header cell.
   *
   * @return string
   */
  public function getHtmlColumnHeader()
  {
    if ($this->headerText===null)
    {
      $header_text = '';
      $class       = 'empty';
    }
    else
    {
      $header_text = (is_int($this->headerText)) ? Babel::getWord($this->headerText) : $this->headerText;
      if ($this->sortable)
      {
        // Add class indicating this column can be used for sorting.
        $class = 'sort';

        // Add class indicating the sort order of this column.
        if ($this->sortOrder)
        {
          if ($class) $class .= ' ';

          // Add class indicating this column can be used for sorting.
          $class .= 'sort-order-';
          $class .= $this->sortOrder;

          $class .= ($this->sortDirection=='desc') ? ' sorted-desc' : ' sorted-asc';
        }
      }
      else
      {
        $class = null;
      }
    }

    return '<th'.Html::generateAttribute('class', $class).'>'.Html::txt2Html($header_text).'</th>';
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns true if and only if this column has no header text.
   *
   * @return bool
   */
  public function hasEmptyHeader()
  {
    return !isset($this->headerText);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * If this columns is sortable sets this column as not sortable (overriding the default behaviour a child class).
   * Has no effect when this column is not sortable.
   */
  public function notSortable()
  {
    $this->sortable = false;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * This function is called by OverviewTable::addColumn.
   *
   * @param OverviewTable $table
   * @param int           $columnIndex
   */
  public function onAddColumn($table, $columnIndex)
  {
    // Nothing to do.
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Sets the sorting order of this column.
   *
   * @param int  $sortOrder      The sorting order.
   * @param bool $descendingFlag If true the data is sorted descending, otherwise ascending.
   */
  public function setSortOrder($sortOrder, $descendingFlag = false)
  {
    $this->sortDirection = ($descendingFlag) ? 'desc' : 'asc';
    $this->sortOrder     = $sortOrder;
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
