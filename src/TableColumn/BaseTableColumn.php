<?php
declare(strict_types=1);

namespace SetBased\Abc\Table\TableColumn;

use SetBased\Abc\Abc;
use SetBased\Abc\Helper\Html;
use SetBased\Abc\Table\OverviewTable;

/**
 * Abstract parent class for generating HTML code for table cells in an overview table.
 */
abstract class BaseTableColumn
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * The attributes of the col element of this table column.
   *
   * @var ColElement
   */
  protected $col;

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
   * @var int|null
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
   * Object  constructor.
   *
   * @param string $dataType The data type of this table column.
   */
  public function __construct(string $dataType)
  {
    $this->col = new ColElement();
    $this->col->setAttrData('type', $dataType);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the number of columns spanned by this object.
   *
   * @return int
   */
  public function getColSpan(): int
  {
    return 1;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the data type of this table column.
   *
   * @return string
   */
  public function getDataType(): string
  {
    return $this->col->getAttribute('data-type');
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns HTML code for the col element of this table column.
   *
   * @return string
   */
  public function getHtmlCol(): string
  {
    return $this->col->getHtmlCol();
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns HTML code (including opening and closing th tags) for the table filter cell.
   *
   * @return string
   */
  public function getHtmlColumnFilter(): string
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
  public function getHtmlColumnHeader(): string
  {
    $attributes = [];
    $classes    = [];

    if ($this->headerText===null)
    {
      $header_text = '';
      $classes[]   = 'empty';
    }
    else
    {
      $header_text = (is_int($this->headerText)) ? Abc::$babel->getWord($this->headerText) : $this->headerText;
      if ($this->sortable)
      {
        // Add class indicating this column can be used for sorting.
        $classes[] = 'sort';

        // Add attributes indicating the sort order of this column and direction.
        if ($this->sortOrder!==null)
        {
          $attributes['data-sort-order'] = $this->sortOrder;

          $classes[] = ($this->sortDirection=='desc') ? ' sorted-desc' : ' sorted-asc';
        }
      }
    }

    $attributes['class'] = implode(' ', $classes);

    return Html::generateElement('th', $attributes, $header_text);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns true if and only if this column has no header text.
   *
   * @return bool
   */
  public function hasEmptyHeader(): bool
  {
    return ($this->headerText===null);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * If this columns is sortable sets this column as not sortable (overriding the default behaviour a child class).
   * Has no effect when this column is not sortable.
   */
  public function notSortable(): void
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
  public function onAddColumn(OverviewTable $table, int $columnIndex): void
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
  public function setSortOrder(int $sortOrder, bool $descendingFlag = false): void
  {
    $this->sortDirection = ($descendingFlag) ? 'desc' : 'asc';
    $this->sortOrder     = $sortOrder;
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
