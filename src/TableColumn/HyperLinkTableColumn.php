<?php
declare(strict_types=1);

namespace Plaisio\Table\TableColumn;

use Plaisio\Helper\Html;
use Plaisio\Helper\RenderWalker;

/**
 * Table column for table cells with a hyperlink.
 */
class HyperLinkTableColumn extends UniTableColumn
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
   * @param int|string|null $header       The header text of this table column.
   * @param string          $fieldName    The key to be used for getting the value from the data row.
   * @param bool            $headerIsHtml If and only if true the header is HTML code.
   */
  public function __construct(int|string|null $header, string $fieldName, bool $headerIsHtml = false)
  {
    parent::__construct('text', $header, $headerIsHtml);

    $this->fieldName = $fieldName;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * {@inheritdoc}
   */
  public function htmlCell(RenderWalker $walker, array $row): string
  {
    $url = $row[$this->fieldName];

    if ($url===null || $url==='')
    {
      $inner = null;
    }
    else
    {
      $inner = ['tag'  => 'a',
                'attr' => ['class' => 'link', 'href' => $url],
                'text' => $url];
    }

    $struct = ['tag'   => 'td',
               'attr'  => ['class' => $walker->getClasses(['cell', 'cell-link'])],
               'inner' => $inner];

    return Html::htmlNested($struct);
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
