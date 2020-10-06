<?php
declare(strict_types=1);

namespace Plaisio\Table\TableColumn;

use Plaisio\Helper\Html;

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
  protected ColElement $col2;

  /**
   * If and only if true the second column can be used for sorting the data in the table of this column.
   *
   * @var bool
   */
  protected bool $isSortable2 = true;

  /**
   * The sort direction of the data in the second column.
   *
   * @var string
   */
  protected string $sortDirection2 = 'asc';

  /**
   * If set the data in the table of the second column is sorted or must be sorted by this column (and possible by other
   * columns) and its value determines the order in which the data of the table is sorted.
   *
   * @var int|null
   */
  protected ?int $sortOrder2;

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
    parent::__construct($dataType1, $header, $headerIsHtml);

    $this->col2 = new ColElement();
    $this->col2->setAttrData('type', $dataType2);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the number of columns spanned, i.e. 2.
   *
   * @return int
   */
  public function getColSpan(): int
  {
    return 2;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns HTML code for the col elements for this table columns.
   *
   * @return string
   */
  public function getHtmlCol(): string
  {
    return parent::getHtmlCol().$this->col2->getHtmlCol();
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns HTML code (including opening and closing @a th tags) for filtering this table columns.
   *
   * @return string
   */
  public function getHtmlColumnFilter(): string
  {
    return '<td><input type="text"/></td><td><input type="text"/></td>';
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns HTML code (including opening and closing th tags) for the header of this table columns.
   *
   * @return string
   */
  public function getHtmlColumnHeader(): string
  {
    $attributes = [];
    $classes    = [];

    // Add class indicating this column can be used for sorting.
    if ($this->isSortable)
    {
      $classes[] = 'sort-1';

      // Add attributes indicating the sort order of this column and direction.
      if ($this->sortOrder!==null)
      {
        $attributes['data-sort-order-1'] = $this->sortOrder;

        $classes[] = ($this->sortDirection==='desc') ? 'sorted-1-desc' : 'sorted-1-asc';
      }
    }

    // Add class indicating this column can be used for sorting.
    if ($this->isSortable2)
    {
      $classes[] = 'sort-2';

      // Add attributes indicating the sort order of this column and direction.
      if ($this->sortOrder2!==null)
      {
        $attributes['data-sort-order-2'] = $this->sortOrder2;

        $classes[] = ($this->sortDirection2==='desc') ? 'sorted-2-desc' : 'sorted-2-asc';
      }
    }

    $attributes['class']   = implode(' ', $classes);
    $attributes['colspan'] = 2;

    $innerText = '<span>&nbsp;</span>'.($this->headerIsHtml ? $this->header : Html::txt2Html($this->header));

    return Html::generateElement('th', $attributes, $innerText, true);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Sets the sorting order of the first table column.
   *
   * @param int  $sortOrder      The sorting order.
   * @param bool $descendingFlag If set the data is sorted descending, otherwise ascending.
   */
  public function setSortOrder1(int $sortOrder, bool $descendingFlag = false): void
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
  public function setSortOrder2(int $sortOrder, bool $descendingFlag = false): void
  {
    $this->sortDirection2 = ($descendingFlag) ? 'desc' : 'asc';
    $this->sortOrder2     = $sortOrder;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Sets whether both the first and the second column is sortable.
   *
   * @param bool $isSortable If and only of true both columns can be used for sorting the data in the table.
   */
  public function setSortable(bool $isSortable): void
  {
    $this->isSortable  = $isSortable;
    $this->isSortable2 = $isSortable;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Sets whether the first column is sortable.
   *
   * @param bool $isSortable If and only of true the first column can be used for sorting the data in the table.
   */
  public function setSortable1(bool $isSortable): void
  {
    $this->isSortable = $isSortable;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Sets whether the second column is sortable.
   *
   * @param bool $isSortable If and only of true the second column can be used for sorting the data in the table.
   */
  public function setSortable2(bool $isSortable): void
  {
    $this->isSortable2 = $isSortable;
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
