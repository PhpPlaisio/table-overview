<?php
declare(strict_types=1);

namespace Plaisio\Table\TableColumn;

use Plaisio\Helper\Html;
use Plaisio\Helper\RenderWalker;
use Plaisio\Kernel\Nub;
use Plaisio\Table\OverviewTable;

/**
 * Abstract parent class for generating HTML code for table cells in an overview table.
 */
abstract class UniTableColumn implements TableColumn
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
  protected ?string $header;

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
  protected ?int $sortOrder = null;

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
   * @inheritdoc
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
   * @inheritdoc
   */
  public function getHeader(): ?string
  {
    return $this->header;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritdoc
   */
  public function getHtmlCol(): string
  {
    return $this->col->getHtmlCol();
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritdoc
   */
  public function getHtmlColumnFilter(RenderWalker $walker): string
  {
    $attributes = ['class' => $walker->getClasses('filter')];

    if ($this->header===null)
    {
      // If the column header is empty there is no column filter by default. This behaviour can be overridden in a
      // child class.
      $ret = Html::generateElement('td', $attributes);
    }
    else
    {
      // The default filter is a simple text filter.
      $ret = Html::generateTag('td', $attributes);
      $ret .= Html::generateVoidElement('input', ['class' => $walker->getClasses('filter-text'), 'type' => 'text']);
      $ret .= '</td>';
    }

    return $ret;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritdoc
   */
  public function getHtmlColumnHeader(RenderWalker $walker): string
  {
    $attributes = ['class' => $walker->getClasses('header')];
    if ($this->header!==null)
    {
      if ($this->isSortable)
      {
        // Add class indicating this column can be used for sorting.
        $attributes['class'][] = 'is-sortable';

        // Add attributes indicating the sort order of this column and direction.
        if ($this->sortOrder!==null)
        {
          $attributes['data-sort-order'] = $this->sortOrder;

          $attributes['class'][] = ($this->sortDirection==='desc') ? 'is-sorted-desc' : 'is-sorted-asc';
        }
      }
    }

    return Html::generateElement('th', $attributes, $this->header, $this->headerIsHtml);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the sort direction (asc or desc) of the data in this column.
   *
   * @return string
   */
  public function getSortDirection(): string
  {
    return $this->sortDirection;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the sort order of the data in this column.
   *
   * @return int|null
   */
  public function getSortOrder(): ?int
  {
    return $this->sortOrder;
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
   * @inheritdoc
   */
  public function isHeaderEmpty(): bool
  {
    return ($this->header===null);
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
   * @inheritdoc
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
   * @inheritdoc
   */
  public function setSortable(bool $isSortable): self
  {
    $this->isSortable = $isSortable;

    return $this;
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
