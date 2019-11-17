<?php
declare(strict_types=1);

namespace Plaisio\Table\TableColumn;

/**
 * Table column combining two columns under one column header.
 */
class CombinedTableColumn extends DualTableColumn
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * The first table column.
   *
   * @var TableColumn
   */
  private $column1;

  /**
   * The second table column.
   *
   * @var TableColumn
   */
  private $column2;

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Object constructor.
   *
   * @param string|int|null $headerText The header of this column.
   * @param TableColumn     $column1    The first table column.
   * @param TableColumn     $column2    The second table column.
   */
  public function __construct($headerText, TableColumn $column1, TableColumn $column2)
  {
    parent::__construct($column1->getDataType(), $column2->getDataType(), $headerText);

    $this->column1 = $column1;
    $this->column2 = $column2;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns HTML code (including opening and closing td tags) for the table cell.
   *
   * @param array $row The data of a row in the overview table.
   *
   * @return string
   */
  public function getHtmlCell(array $row): string
  {
    return $this->column1->getHtmlCell($row).$this->column2->getHtmlCell($row);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns HTML code (including opening and closing @a th tags) for filtering this table columns.
   *
   * @return string
   */
  public function getHtmlColumnFilter(): string
  {
    return $this->column1->getHtmlColumnFilter().$this->column2->getHtmlColumnFilter();
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Sets the sorting order of the first table column.
   *
   * @param int  $sortOrder      The sorting order.
   * @param bool $descendingFlag If set the data is sorted descending, otherwise ascending.
   */
  public function sortOrder1(int $sortOrder, bool $descendingFlag = false): void
  {
    $this->column1->setSortOrder($sortOrder, $descendingFlag);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Sets the sorting order of second table column.
   *
   * @param int  $sortOrder      The sorting order.
   * @param bool $descendingFlag If set the data is sorted descending, otherwise ascending.
   */
  public function sortOrder2(int $sortOrder, bool $descendingFlag = false): void
  {
    $this->column2->setSortOrder($sortOrder, $descendingFlag);
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
