<?php
declare(strict_types=1);

namespace Plaisio\Table\TableColumn;

use Plaisio\Helper\Html;
use Plaisio\Table\Walker\RenderWalker;

/**
 * Table column for table cells with arbitrary HTML code..
 */
class HtmlTableColumn extends UniTableColumn
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * The field name of the data row used for generating this table column.
   *
   * @var string
   */
  protected string $fieldName;

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Object constructor.
   *
   * @param string|int|null $header       The header text of this table column.
   * @param string          $fieldName    The key to be used for getting the value from the data row.
   * @param bool            $headerIsHtml If and only if true the header is HTML code.
   */
  public function __construct($header, string $fieldName, bool $headerIsHtml = false)
  {
    parent::__construct('text', $header, $headerIsHtml);

    $this->fieldName = $fieldName;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * {@inheritdoc}
   */
  public function getHtmlCell(RenderWalker $walker, array $row): string
  {
    return Html::generateElement('td', ['class' => $walker->getClasses('text')], $row[$this->fieldName], true);
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
