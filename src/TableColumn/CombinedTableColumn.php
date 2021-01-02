<?php
declare(strict_types=1);

namespace Plaisio\Table\TableColumn;

use Plaisio\Kernel\Nub;
use Plaisio\Table\OverviewTable;
use Plaisio\Table\Walker\RenderWalker;

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
  public function getHtmlCell(RenderWalker $walker, array $row): string
  {
    return $this->column1->getHtmlCell($walker, $row).$this->column2->getHtmlCell($walker, $row);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritdoc
   */
  public function getHtmlCol(): string
  {
    return $this->column1->getHtmlCol().$this->column2->getHtmlCol();
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritdoc
   */
  public function getHtmlColumnFilter(RenderWalker $walker): string
  {
    return $this->column1->getHtmlColumnFilter($walker).$this->column2->getHtmlColumnFilter($walker);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritdoc
   */
  public function getHtmlColumnHeader(RenderWalker $walker): string
  {
    return $this->column1->getHtmlColumnHeader($walker).$this->column2->getHtmlColumnHeader($walker);
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
