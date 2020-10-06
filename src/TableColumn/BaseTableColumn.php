<?php
declare(strict_types=1);

namespace Plaisio\Table\TableColumn;

use Plaisio\Helper\Html;
use Plaisio\Kernel\Nub;
use Plaisio\Table\OverviewTable;

/**
 * Abstract parent class for generating HTML code for table cells in an overview table.
 */
abstract class BaseTableColumn
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * The col element of this column.
   *
   * @var ColElement
   */
  protected ColElement $col;

  /**
   * The header of this column.
   *
   * @var string|null
   */
  protected ? string $header;

  /**
   * If and only if true the header is HTML code.
   *
   * @var bool
   */
  protected bool $headerIsHtml;

  /**
   * If and only if true this column can be used for sorting the data in the table of this column.
   *
   * @var bool
   */
  protected bool $isSortable = true;

  /**
   * The sort direction of the data in this column.
   *
   * @var string
   */
  protected string $sortDirection = 'asc';

  /**
   * If set the data in the table of this column is sorted or must be sorted by this column (and possible by other
   * columns) and its value determines the order in which the data of the table is sorted.
   *
   * @var int|null
   */
  protected ?int $sortOrder;

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Object  constructor.
   *
   * @param string          $dataType     The data type of this table column.
   * @param string|int|null $header       The header of this column. We distinguish 3 types:
   *                                      <ul>
   *                                      <li>string: the value is the header text of this table column,
   *                                      <li>null: this table column has header without a text and with class 'empty',
   *                                      <li>int: the value is a word ID to be resolved to a text using Babel.
   *                                      </ul>
   *                                      Note: 14 is a word ID and '14' is a header text.
   * @param bool            $headerIsHtml If and only if true the header is HTML code.
   */
  public function __construct(string $dataType, $header, bool $headerIsHtml = false)
  {
    $this->col = new ColElement();
    $this->col->setAttrData('type', $dataType);

    $this->header       = (is_int($header)) ? Nub::$nub->babel->getWord($header) : $header;
    $this->headerIsHtml = $headerIsHtml;
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
   * Returns the text of this header.
   *
   * @return string|null
   */
  public function getHeader(): ?string
  {
    return $this->header;
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
    if ($this->header===null)
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

    if ($this->header===null)
    {
      $classes[] = 'empty';
    }
    else
    {
      if ($this->isSortable)
      {
        // Add class indicating this column can be used for sorting.
        $classes[] = 'sort';

        // Add attributes indicating the sort order of this column and direction.
        if ($this->sortOrder!==null)
        {
          $attributes['data-sort-order'] = $this->sortOrder;

          $classes[] = ($this->sortDirection==='desc') ? 'sorted-desc' : 'sorted-asc';
        }
      }
    }

    $attributes['class'] = implode(' ', $classes);

    return Html::generateElement('th', $attributes, $this->header, $this->headerIsHtml);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns true if and only if this column has no header text.
   *
   * @return bool
   */
  public function headerIsEmpty(): bool
  {
    return ($this->header===null);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns true if and only the header is HTML code
   *
   * @return bool
   */
  public function headerIsHtml(): bool
  {
    return $this->headerIsHtml;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns true if o=and only if this column can be used for sorting the data in the table of this column.
   *
   * @return bool
   */
  public function isSortable(): bool
  {
    return $this->isSortable;
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
  /**
   * Set whether this column can be used for sorting the data in the table of this column. By defaults this column be
   * used for sorting the table.
   *
   * @param bool $isSortable If and only of true this column can be used for sorting the data in the table of this
   *                         column.
   */
  public function setSortable(bool $isSortable): void
  {
    $this->isSortable = $isSortable;
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
