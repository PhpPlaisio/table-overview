<?php
declare(strict_types=1);

namespace Plaisio\Table\TableColumn;

use Plaisio\Helper\Html;
use Plaisio\Kernel\Nub;
use Plaisio\Table\OverviewTable;
use Plaisio\Table\Walker\RenderWalker;

/**
 * Abstract class for classes for generating HTML code for two columns in an overview table with a single header.
 */
abstract class DualTableColumn implements TableColumn
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * The attributes of the first col element of this table column.
   *
   * @var ColElement
   */
  protected ColElement $col1;

  /**
   * The attributes of the second col element of this table column.
   *
   * @var ColElement
   */
  protected ColElement $col2;

  /**
   * If and only if true the header is HTML code.
   *
   * @var bool
   */
  protected bool $headerIsHtml;

  /**
   * Whether the first column can be used for sorting the data in the table of this column.
   *
   * @var bool
   */
  protected bool $isSortable1 = true;

  /**
   * Whether the second column can be used for sorting the data in the table of this column.
   *
   * @var bool
   */
  protected bool $isSortable2 = true;

  /**
   * The sort direction of the data in the first column.
   *
   * @var string
   */
  protected string $sortDirection1 = 'asc';

  /**
   * The sort direction of the data in the second column.
   *
   * @var string
   */
  protected string $sortDirection2 = 'asc';

  /**
   * If set the data in the table of the first column is sorted or must be sorted by this column (and possible by other
   * columns) and its value determines the order in which the data of the table is sorted.
   *
   * @var int|null
   */
  protected ?int $sortOrder1 = null;

  /**
   * If set the data in the table of the second column is sorted or must be sorted by this column (and possible by other
   * columns) and its value determines the order in which the data of the table is sorted.
   *
   * @var int|null
   */
  protected ?int $sortOrder2 = null;

  /**
   * @var int|string|null
   */
  private $header;

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Object constructor.
   *
   * @param string          $dataType1    The data type of the first column.
   * @param string          $dataType2    The data type of the second column.
   * @param string|int|null $header       The header of this table column.
   * @param bool            $headerIsHtml If and only if true the header is HTML code.
   */
  public function __construct(string $dataType1, string $dataType2, $header, bool $headerIsHtml = false)
  {
    $this->col1 = new ColElement();
    $this->col1->setAttrData('type', $dataType1);

    $this->col2 = new ColElement();
    $this->col2->setAttrData('type', $dataType2);

    $this->header       = (is_int($header)) ? Nub::$nub->babel->getWord($header) : $header;
    $this->headerIsHtml = $headerIsHtml;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritdoc
   */
  public function getColSpan(): int
  {
    return 2;
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
    return $this->col1->getHtmlCol().$this->col2->getHtmlCol();
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritdoc
   */
  public function getHtmlColumnFilter(RenderWalker $walker): string
  {
    if ($this->header===null)
    {
      // If the column header is empty there is no column filter by default. This behaviour can be overridden in a
      // child class.
      $ret = Html::generateElement('td', ['class' => $walker->getClasses('filter')]);
      $ret .= $ret;
    }
    else
    {
      // The default filter is a simple text filter.
      $ret = Html::generateTag('td', ['class' => $walker->getClasses('filter')]);
      $ret .= Html::generateElement('input', ['class' => $walker->getClasses('filter-text'), 'type' => 'text']);
      $ret .= '</td>';
      $ret .= $ret;
    }

    return $ret;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritdoc
   */
  public function getHtmlColumnHeader(RenderWalker $walker): string
  {
    $attributes = [];
    $classes    = $walker->getClasses('header');

    // Add class indicating this column can be used for sorting.
    if ($this->isSortable1)
    {
      $classes[] = 'is-sortable-1';

      // Add attributes indicating the sort order of this column and direction.
      if ($this->sortOrder1!==null)
      {
        $attributes['data-sort-order-1'] = $this->sortOrder1;

        $classes[] = ($this->sortDirection1==='desc') ? 'is-sorted-1-desc' : 'is-sorted-1-asc';
      }
    }

    // Add class indicating this column can be used for sorting.
    if ($this->isSortable2)
    {
      $classes[] = 'is-sortable-2';

      // Add attributes indicating the sort order of this column and direction.
      if ($this->sortOrder2!==null)
      {
        $attributes['data-sort-order-2'] = $this->sortOrder2;

        $classes[] = ($this->sortDirection2==='desc') ? 'is-sorted-2-desc' : 'is-sorted-2-asc';
      }
    }

    $attributes['class']   = $classes;
    $attributes['colspan'] = 2;

    $innerText = '<span>&nbsp;</span>'.($this->headerIsHtml ? $this->header : Html::txt2Html($this->header));

    return Html::generateElement('th', $attributes, $innerText, true);
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
   * @inheritdoc
   */
  public function onAddColumn(OverviewTable $table, int $columnIndex): void
  {
    // Nothing to do.
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Sets the sorting order of the first table column.
   *
   * @param int  $sortOrder      The sorting order.
   * @param bool $descendingFlag If set the data is sorted descending, otherwise ascending.
   *
   * @return $this
   */
  public function setSortOrder1(int $sortOrder, bool $descendingFlag = false): self
  {
    $this->sortDirection1 = ($descendingFlag) ? 'desc' : 'asc';
    $this->sortOrder1     = $sortOrder;

    return $this;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Sets the sorting order of second table column.
   *
   * @param int  $sortOrder      The sorting order.
   * @param bool $descendingFlag If set the data is sorted descending, otherwise ascending.
   *
   * @return $this
   */
  public function setSortOrder2(int $sortOrder, bool $descendingFlag = false): self
  {
    $this->sortDirection2 = ($descendingFlag) ? 'desc' : 'asc';
    $this->sortOrder2     = $sortOrder;

    return $this;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Sets whether both the first and the second column are sortable.
   *
   * @param bool $isSortable Whether both columns can be used for sorting the data in the table.
   *
   * @return $this
   */
  public function setSortable(bool $isSortable): self
  {
    $this->isSortable1 = $isSortable;
    $this->isSortable2 = $isSortable;

    return $this;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Sets whether the first column is sortable.
   *
   * @param bool $isSortable Whether the first column can be used for sorting the data in the table.
   *
   * @return $this
   */
  public function setSortable1(bool $isSortable): self
  {
    $this->isSortable1 = $isSortable;

    return $this;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Sets whether the second column is sortable.
   *
   * @param bool $isSortable Whether the second column can be used for sorting the data in the table.
   *
   * @return $this
   */
  public function setSortable2(bool $isSortable): self
  {
    $this->isSortable2 = $isSortable;

    return $this;
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
