<?php
declare(strict_types=1);

namespace Plaisio\Table;

use Plaisio\Helper\Css;
use Plaisio\Helper\Html;
use Plaisio\Helper\HtmlElement;
use Plaisio\Helper\RenderWalker;
use Plaisio\Kernel\Nub;
use Plaisio\Table\TableColumn\TableColumn;

/**
 * Class for generating tables with an overview of a list of entities.
 *
 * @property-read RenderWalker $renderWalker The render walker.
 */
class OverviewTable
{
  //--------------------------------------------------------------------------------------------------------------------
  use HtmlElement;

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * The default CSS module class.
   *
   * @var string
   */
  public static string $defaultModuleClass = 'ot';

  /**
   * If set CSS for responsive table will generated.
   *
   * @var string|null
   */
  public static ?string $responsiveMediaQuery;

  /**
   * If set to true the header will contain a row for filtering.
   *
   * @var bool
   */
  protected bool $filter = false;

  /**
   * If set to true the table is sortable.
   *
   * @var bool
   */
  protected bool $sortable = true;

  /**
   * The index in $columns of the next column added to this table.
   *
   * @var int
   */
  private int $columnIndex = 1;

  /**
   * The objects for generating the columns of this table.
   *
   * @var TableColumn[]
   */
  private array $columns = [];

  /**
   * The title of this table.
   *
   * @var string|null
   */
  private ?string $title = null;

  //--------------------------------------------------------------------------------------------------------------------

  /**
   * OverviewTable constructor.
   */
  public function __construct()
  {
    $this->renderWalker = new RenderWalker('ot');
  }

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
    $this->prepare();

    $ret = $this->getHtmlPrefix();

    $ret .= Html::generateTag('table', $this->attributes);

    $ret .= $this->getHtmlColGroup();
    $ret .= $this->getHtmlHeader();
    $ret .= $this->getHtmlBody($rows);
    $ret .= $this->getHtmlFooter();

    $ret .= '</table>';

    $ret .= $this->getHtmlPostfix();

    $this->generateResponsiveCss();

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
   * Returns the inner HTML code of the body for this table holding the rows as data.
   *
   * @param array[] $rows The data of the rows.
   *
   * @return string
   */
  protected function getHtmlBody(array $rows): string
  {
    $ret = Html::generateTag('tbody', ['class' => $this->renderWalker->getClasses()]);
    $i   = 0;
    foreach ($rows as $row)
    {
      $classes   = $this->renderWalker->getClasses('row');
      $classes[] = ($i % 2===0) ? 'is-even' : 'is-odd';
      $ret       .= Html::generateTag('tr', ['class' => $classes]);
      foreach ($this->columns as $column)
      {
        $ret .= $column->getHtmlCell($this->renderWalker, $row);
      }
      $ret .= '</tr>';
      $i++;
    }
    $ret .= '</tbody>';

    return $ret;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the column group element of the table.
   *
   * @return string
   */
  protected function getHtmlColGroup(): string
  {
    $ret = '<colgroup>';
    foreach ($this->columns as $column)
    {
      // If required disable sorting of this column.
      if (!$this->sortable)
      {
        $column->setSortable(false);
      }

      $ret .= $column->getHtmlCol();
    }
    $ret .= '</colgroup>';

    return $ret;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the foot element of the table.
   *
   * @return string
   */
  protected function getHtmlFooter(): string
  {
    return '';
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the HTML code of the header for this table.
   *
   * @return string
   */
  protected function getHtmlHeader(): string
  {
    $ret = Html::generateTag('thead', ['class' => $this->renderWalker->getClasses()]);
    $ret .= $this->getHtmlInnerHeader();
    $ret .= '</thead>';

    return $ret;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the inner HTML code of the header for this table.
   *
   * @return string
   */
  protected function getHtmlInnerHeader(): string
  {
    $ret = '';
    if ($this->title!==null)
    {
      $mode    = 1;
      $colspan = 0;

      $ret .= Html::generateTag('tr', ['class' => $this->renderWalker->getClasses('title')]);
      foreach ($this->columns as $column)
      {
        $empty = $column->isHeaderEmpty();

        if ($mode===1)
        {
          if ($empty)
          {
            $ret .= Html::generateElement('th', ['class' => $this->renderWalker->getClasses('empty-header')]);
          }
          else
          {
            $mode = 2;
          }
        }

        if ($mode===2)
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

        if ($mode===3)
        {
          if ($colspan===1) $colspan = null;
          $ret  .= Html::generateElement('th',
                                         ['class'   => $this->renderWalker->getClasses('header'),
                                          'colspan' => $colspan],
                                         $this->title);
          $mode = 4;
        }

        if ($mode===4)
        {
          $ret .= Html::generateElement('th', ['class' => $this->renderWalker->getClasses('empty-header')]);
        }
      }

      if ($mode===2)
      {
        if ($colspan===1) $colspan = null;
        $ret .= Html::generateElement('th',
                                      ['class'   => $this->renderWalker->getClasses('header'),
                                       'colspan' => $colspan],
                                      $this->title);
      }

      $ret .= '</tr>';
    }

    $ret .= Html::generateTag('tr', ['class' => $this->renderWalker->getClasses('header-row')]);
    foreach ($this->columns as $column)
    {
      $ret .= $column->getHtmlColumnHeader($this->renderWalker);
    }
    $ret .= '</tr>';

    if ($this->filter)
    {
      $ret .= Html::generateTag('tr', ['class' => $this->renderWalker->getClasses('filter-row')]);
      foreach ($this->columns as $column)
      {
        $ret .= $column->getHtmlColumnFilter($this->renderWalker);
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
  /**
   * Generates CSS for responsive tables.
   */
  private function generateResponsiveCss()
  {
    if (static::$responsiveMediaQuery===null) return;

    Nub::$nub->assets->cssAppendLine(static::$responsiveMediaQuery);
    Nub::$nub->assets->cssAppendLine('{');
    $id     = $this->getAttribute('id');
    $format = '#%s .%s-row > td:nth-of-type(%d):before {content: %s;}';
    foreach ($this->columns as $index => $column)
    {
      $text = $column->getHeader();
      for ($i = 0; $i<$column->getColSpan(); $i++)
      {
        Nub::$nub->assets->cssAppendLine(sprintf($format,
                                                 $id,
                                                 $this->renderWalker->getModuleClass(),
                                                 $index + $i,
                                                 Css::txt2CssString($text)));
      }
    }
    Nub::$nub->assets->cssAppendLine('}');
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Prepares this table for generation HTML code.
   */
  private function prepare(): void
  {
    $this->addClasses($this->renderWalker->getClasses());
    $this->setAttrData('overview-table', $this->renderWalker->getModuleClass());

    if (static::$responsiveMediaQuery!==null && $this->getAttribute('id')===null)
    {
      $this->setAttrId(Html::getAutoId());
    }
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
