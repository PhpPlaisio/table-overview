<?php
declare(strict_types=1);

namespace Plaisio\Table;

use Plaisio\Helper\Css;
use Plaisio\Helper\Html;
use Plaisio\Helper\HtmlElement;
use Plaisio\Helper\RenderWalker;
use Plaisio\Kernel\Nub;
use Plaisio\Table\TableColumn\TableColumn;
use Plaisio\Table\TableRow\TableRow;
use Plaisio\Table\TableRow\ZebraTableRow;

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
   * If set CSS for responsive table will be generated.
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
   * Helper class for generating the attributes of the table rows.
   *
   * @var TableRow
   */
  private TableRow $tableRow;

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
    $this->renderWalker = new RenderWalker(self::$defaultModuleClass);
    $this->tableRow     = new ZebraTableRow();
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
  public function disableFilter(): self
  {
    $this->filter = false;

    return $this;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Disables sorting for all columns in table.
   */
  public function disableSorting(): self
  {
    $this->sortable = false;

    return $this;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Enables table filtering.
   */
  public function enableFilter(): self
  {
    $this->filter = true;

    return $this;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Enables sorting of columns in this table.
   */
  public function enableSorting(): self
  {
    $this->sortable = true;

    return $this;
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
   * Returns the HTML code of this table.
   *
   * @param array[] $rows The data shown in the table.
   *
   * @return string
   */
  public function htmlTable(array $rows): string
  {
    $this->prepare();
    $this->generateResponsiveCss();

    $struct = [['html' => $this->htmlPrefix()],
               ['tag'   => 'table',
                'attr'  => $this->attributes,
                'inner' => [['html' => $this->htmlColGroup()],
                            ['html' => $this->htmlHeader()],
                            ['html' => $this->htmlBody($rows)],
                            ['html' => $this->htmlFooter()]]],
               ['html' => $this->htmlPostfix()]];

    return Html::htmlNested($struct);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Sets the helper class for generating the table row attributes.
   *
   * @param TableRow $tableRow The helper class for generating the table row attributes.
   */
  public function setTableRow(TableRow $tableRow): void
  {
    $this->tableRow = $tableRow;
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
  protected function htmlBody(array $rows): string
  {
    $i        = 0;
    $htmlRows = '';
    foreach ($rows as $row)
    {
      $htmlCells = '';
      foreach ($this->columns as $column)
      {
        $htmlCells .= $column->htmlCell($this->renderWalker, $row);
      }

      $htmlRows .= Html::htmlNested(['tag'  => 'tr',
                                     'attr' => $this->tableRow->getRowAttributes($this->renderWalker, $i, $row),
                                     'html' => $htmlCells]);
      $i++;
    }

    $struct = ['tag'  => 'tbody',
               'attr' => ['class' => $this->renderWalker->getClasses('tbody')],
               'html' => $htmlRows];

    return Html::htmlNested($struct);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the column group element of the table.
   *
   * @return string
   */
  protected function htmlColGroup(): string
  {
    $ret = '<colgroup>';
    foreach ($this->columns as $column)
    {
      // If required disable sorting of this column.
      if (!$this->sortable)
      {
        $column->setSortable(false);
      }

      $ret .= $column->htmlCol();
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
  protected function htmlFooter(): string
  {
    return '';
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the HTML code of the header for this table.
   *
   * @return string
   */
  protected function htmlHeader(): string
  {
    $struct = ['tag'  => 'thead',
               'attr' => ['class' => $this->renderWalker->getClasses('thead')],
               'html' => $this->htmlInnerHeader()];

    return Html::htmlNested($struct);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the inner HTML code of the header for this table.
   *
   * @return string
   */
  protected function htmlInnerHeader(): string
  {
    $struct = [];
    if ($this->title!==null)
    {
      $mode    = 1;
      $colspan = 0;

      $inner = [];
      foreach ($this->columns as $column)
      {
        $empty = $column->isHeaderEmpty();

        if ($mode===1)
        {
          if ($empty)
          {
            $inner[] = ['tag'  => 'th',
                        'attr' => ['class' => $this->renderWalker->getClasses('empty-header')],
                        'html' => null];
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
          if ($colspan===1)
          {
            $colspan = null;
          }
          $inner[] = ['tag'  => 'th',
                      'attr' => ['class'   => $this->renderWalker->getClasses('header'),
                                 'colspan' => $colspan],
                      'text' => $this->title];
          $mode    = 4;
        }

        if ($mode===4)
        {
          $inner[] = ['tag'  => 'th',
                      'attr' => ['class' => $this->renderWalker->getClasses('empty-header')],
                      'html' => null];
        }
      }

      if ($mode===2)
      {
        if ($colspan===1)
        {
          $colspan = null;
        }
        $inner[] = ['tag'  => 'th',
                    'attr' => ['class'   => $this->renderWalker->getClasses('header'),
                               'colspan' => $colspan],
                    'text' => $this->title];
      }

      $struct[] = ['tag'   => 'tr',
                   'attr'  => ['class' => $this->renderWalker->getClasses('title')],
                   'inner' => $inner];
    }

    $cells = '';
    foreach ($this->columns as $column)
    {
      $cells .= $column->htmlColumnHeader($this->renderWalker);
    }
    $struct[] = ['tag'  => 'tr',
                 'attr' => ['class' => $this->renderWalker->getClasses('header-row')],
                 'html' => $cells];

    if ($this->filter)
    {
      $cells = '';
      foreach ($this->columns as $column)
      {
        $cells .= $column->htmlColumnFilter($this->renderWalker);
      }
      $struct[] = ['tag'  => 'tr',
                   'attr' => ['class' => $this->renderWalker->getClasses('filter-row')],
                   'html' => $cells];
    }

    return Html::htmlNested($struct);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the HTML code inserted before the HTML code of the table.
   *
   * @return string
   */
  protected function htmlPostfix(): string
  {
    return '';
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the HTML code appended after the HTML code of the table.
   *
   * @return string
   */
  protected function htmlPrefix(): string
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
    $this->addClasses($this->renderWalker->getClasses('table'));
    $this->setAttrData('overview-table', $this->renderWalker->getModuleClass());

    if (static::$responsiveMediaQuery!==null && $this->getAttribute('id')===null)
    {
      $this->setAttrId(Html::getAutoId());
    }
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
