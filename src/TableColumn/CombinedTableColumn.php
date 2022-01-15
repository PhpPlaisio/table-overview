<?php
declare(strict_types=1);

namespace Plaisio\Table\TableColumn;

use Plaisio\Helper\Html;
use Plaisio\Helper\RenderWalker;
use Plaisio\Kernel\Nub;
use Plaisio\Table\OverviewTable;

/**
 * Table column combining two columns under one column header.
 */
class CombinedTableColumn implements TableColumn
{
  //--------------------------------------------------------------------------------------------------------------------
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
   * The first table column.
   *
   * @var UniTableColumn
   */
  private UniTableColumn $column1;

  /**
   * The second table column.
   *
   * @var UniTableColumn
   */
  private UniTableColumn $column2;

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Object constructor.
   *
   * @param string|int|null $header       The header of this column.
   * @param UniTableColumn  $column1      The first table column.
   * @param UniTableColumn  $column2      The second table column.
   * @param bool            $headerIsHtml If and only if true the header is HTML code.
   */
  public function __construct($header, UniTableColumn $column1, UniTableColumn $column2, bool $headerIsHtml = false)
  {
    $this->column1 = $column1;
    $this->column2 = $column2;

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
  public function htmlCell(RenderWalker $walker, array $row): string
  {
    return $this->column1->htmlCell($walker, $row).$this->column2->htmlCell($walker, $row);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritdoc
   */
  public function htmlCol(): string
  {
    return $this->column1->htmlCol().$this->column2->htmlCol();
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritdoc
   */
  public function htmlColumnFilter(RenderWalker $walker): string
  {
    return $this->column1->htmlColumnFilter($walker).$this->column2->htmlColumnFilter($walker);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritdoc
   */
  public function htmlColumnHeader(RenderWalker $walker): string
  {
    $attributes = [];
    $classes    = $walker->getClasses('header');

    // Add class indicating this column can be used for sorting.
    if ($this->column1->isSortable())
    {
      $classes[] = 'is-sortable-1';

      // Add attributes indicating the sort order of this column and direction.
      if ($this->column1->getSortOrder()!==null)
      {
        //$attributes['data-sort-order-1'] = $this->column1;

        $classes[] = ($this->column1->getSortDirection()==='desc') ? 'is-sorted-1-desc' : 'is-sorted-1-asc';
      }
    }

    // Add class indicating this column can be used for sorting.
    if ($this->column2->isSortable())
    {
      $classes[] = 'is-sortable-2';

      // Add attributes indicating the sort order of this column and direction.
      if ($this->column2->getSortOrder()!==null)
      {
        // $attributes['data-sort-order-2'] = $this->sortOrder2;

        $classes[] = ($this->column2->getSortDirection()==='desc') ? 'is-sorted-2-desc' : 'is-sorted-2-asc';
      }
    }

    $attributes['class']   = $classes;
    $attributes['colspan'] = 2;

    $struct = ['tag'   => 'th',
               'attr'  => $attributes,
               'inner' => [['html' => '<span>&nbsp;</span>'],
                           [($this->headerIsHtml) ? 'html' : 'text' => $this->header]]];

    return Html::htmlNested($struct);
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
    $this->column1->setSortOrder($sortOrder, $descendingFlag);

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
    $this->column2->setSortOrder($sortOrder, $descendingFlag);

    return $this;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritdoc
   */
  public function setSortable(bool $isSortable): self
  {
    $this->column1->setSortable($isSortable);
    $this->column2->setSortable($isSortable);

    return $this;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Sets whether the first column is sortable.
   *
   * @param bool $isSortable If and only of true the first column can be used for sorting the data in the table.
   *
   * @return $this
   */
  public function setSortable1(bool $isSortable): self
  {
    $this->column1->setSortable($isSortable);

    return $this;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Sets whether the second column is sortable.
   *
   * @param bool $isSortable If and only of true the second column can be used for sorting the data in the table.
   *
   * @return $this
   */
  public function setSortable2(bool $isSortable): self
  {
    $this->column2->setSortable($isSortable);

    return $this;
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
