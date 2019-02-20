<?php

namespace SetBased\Abc\Table;

use SetBased\Abc\Helper\Html;
use SetBased\Abc\HtmlElement;
use SetBased\Abc\Table\TableColumn\TableColumn;

/**
 * Class for generating tables with an overview of a list of entities.
 */
class OverviewTable extends HtmlElement
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * The objects for generating the columns of this table.
   *
   * @var TableColumn[]
   */
  protected $columns = [];

  /**
   * If set to true the header will contain a row for filtering.
   *
   * @var bool
   */
  protected $filter = false;

  /**
   * The title of this table.
   *
   * @var string
   *
   * @deprecated
   */
  protected $title;

  /**
   * The index in $columns of the next column added to this table.
   *
   * @var int
   */
  private $columnIndex = 1;

  /**
   * If set to true the table is sortable.
   *
   * @var bool
   */
  private $sortable = true;

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Adds a column to this table.
   *
   * @param TableColumn $column The column to be added to this table.
   */
  public function addColumn(TableColumn $column): void
  {
    // Add the column to our array of columns.
    $this->columns[$this->columnIndex] = $column;

    $column->onAddColumn($this, $this->columnIndex);

    // Increase the index for the next added column.
    $this->columnIndex += $column->getColSpan();
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Disables table filtering.
   */
  public function disableFilter(): void
  {
    $this->filter = false;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Disables sorting for all columns in table.
   */
  public function disableSorting(): void
  {
    $this->sortable = false;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Enables table filtering.
   */
  public function enableFilter(): void
  {
    $this->filter = true;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the HTML code of this table
   *
   * @param array[] $rows The data shown in the table.
   *
   * @return string
   */
  public function getHtmlTable(array $rows): string
  {
    $ret = $this->getHtmlPrefix();

    $ret .= Html::generateTag('table', $this->attributes);

    // Generate HTML code for the column classes.
    $ret .= '<colgroup>';
    foreach ($this->columns as $column)
    {
      // If required disable sorting of this column.
      if (!$this->sortable) $column->notSortable();

      // Generate column element.
      $ret .= $column->getHtmlCol();
    }
    $ret .= '</colgroup>';

    // Generate HTML code for the table header.
    $ret .= '<thead>';
    $ret .= $this->getHtmlHeader();
    $ret .= '</thead>';

    // Generate HTML code for the table body.
    $ret .= '<tbody>';
    $ret .= $this->getHtmlBody($rows);
    $ret .= '</tbody>';

    $ret .= '</table>';

    $ret .= $this->getHtmlPostfix();

    return $ret;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the total number of columns of this table.
   *
   * @return int
   */
  public function getNumberOfColumns(): int
  {
    return $this->columnIndex - 1;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the title of this table.
   *
   * @deprecated
   */
  public function getTitle(): string
  {
    return $this->title;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Sets the title of this table.
   *
   * @param string $title The title.
   *
   * @deprecated
   */
  public function setTitle(string $title): void
  {
    $this->title = $title;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the inner HTML code of the body for this table holding @a $rows as data.
   *
   * @param array[] $rows
   *
   * @return string
   */
  protected function getHtmlBody(array $rows): string
  {
    $ret = '';
    $i   = 0;
    foreach ($rows as $row)
    {
      if ($i % 2==0) $ret .= '<tr class="even">';
      else           $ret .= '<tr class="odd">';
      foreach ($this->columns as $column)
      {
        $ret .= $column->getHtmlCell($row);
      }
      $ret .= '</tr>';
      $i++;
    }

    return $ret;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the inner HTML code of the header for this table.
   *
   * @return string
   */
  protected function getHtmlHeader(): string
  {
    $ret = '';

    if ($this->title)
    {
      $mode    = 1;
      $colspan = 0;

      $ret .= '<tr class="title">';
      foreach ($this->columns as $column)
      {
        $empty = $column->hasEmptyHeader();

        if ($mode==1)
        {
          if ($empty)
          {
            $ret .= '<th class="empty"></th>';
          }
          else
          {
            $mode = 2;
          }
        }

        if ($mode==2)
        {
          if ($empty)
          {
            $mode = 3;
          }
          else
          {
            $colspan++;
          }
        }

        if ($mode==3)
        {
          if ($colspan==1) $colspan = null;
          $ret  .= Html::generateElement('th', ['colspan' => $colspan], $this->title);
          $mode = 4;
        }

        if ($mode==4)
        {
          $ret .= '<th class="empty"></th>';
        }
      }

      if ($mode==2)
      {
        if ($colspan==1) $colspan = null;
        $ret .= Html::generateElement('th', ['colspan' => $colspan], $this->title);
      }

      $ret .= '</tr>';
    }

    $ret .= '<tr class="header">';
    foreach ($this->columns as $column)
    {
      $ret .= $column->getHtmlColumnHeader();
    }
    $ret .= '</tr>';

    if ($this->filter)
    {
      $ret .= '<tr class="filter">';
      foreach ($this->columns as $column)
      {
        $ret .= $column->getHtmlColumnFilter();
      }
      $ret .= '</tr>';
    }

    return $ret;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns HTML code inserted before the HTML code of the table.
   *
   * @return string
   */
  protected function getHtmlPostfix(): string
  {
    return '';
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns HTML code appended after the HTML code of the table.
   *
   * @return string
   */
  protected function getHtmlPrefix(): string
  {
    return '';
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
