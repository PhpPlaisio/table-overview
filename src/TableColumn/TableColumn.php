<?php
declare(strict_types=1);

namespace Plaisio\Table\TableColumn;

use Plaisio\Table\OverviewTable;
use Plaisio\Table\Walker\RenderWalker;

/**
 * Abstract parent class for generating HTML code for table cells in an overview table.
 */
interface TableColumn
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the number of columns spanned by this object.
   *
   * @return int
   */
  public function getColSpan(): int;

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the text of this header.
   *
   * @return string|null
   */
  public function getHeader(): ?string;

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns HTML code (including opening and closing td tags) for the table cell.
   *
   * @param RenderWalker $walker The object for walking the row and column tree.
   * @param array        $row    The data of a row in the overview table.
   *
   * @return string
   */
  public function getHtmlCell(RenderWalker $walker, array $row): string;

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns HTML code for the col element of this table column.
   *
   * @return string
   */
  public function getHtmlCol(): string;

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns HTML code (including opening and closing th tags) for the table filter cell.
   *
   * @param RenderWalker $walker The object for walking the columns.
   *
   * @return string
   */
  public function getHtmlColumnFilter(RenderWalker $walker): string;

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns HTML code (including opening and closing th tags) for the table header cell.
   *
   * @param RenderWalker $walker The object for walking the columns.
   *
   * @return string
   */
  public function getHtmlColumnHeader(RenderWalker $walker): string;

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns whether this column has no header text.
   *
   * @return bool
   */
  public function isHeaderEmpty(): bool;

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * This function is called by OverviewTable::addColumn.
   *
   * @param OverviewTable $table
   * @param int           $columnIndex
   */
  public function onAddColumn(OverviewTable $table, int $columnIndex): void;

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Set whether this column can be used for sorting the data in the table of this column.
   *
   * @param bool $isSortable Whether this column is sortable.
   *
   * @return $this
   */
  public function setSortable(bool $isSortable): self;

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
