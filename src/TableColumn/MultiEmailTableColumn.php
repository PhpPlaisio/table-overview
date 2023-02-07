<?php
declare(strict_types=1);

namespace Plaisio\Table\TableColumn;

use Plaisio\Helper\Html;
use Plaisio\Helper\RenderWalker;

/**
 * Table column for table cells with multiple email addresses.
 */
class MultiEmailTableColumn extends UniTableColumn
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * The character for separating multiple email addresses in the input data.
   *
   * @var string
   */
  protected string $dataSeparator;

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
   * @param string|int|null $header        The header text of this table column.
   * @param string          $fieldName     The key to be used for getting the value from the data row.
   * @param string          $dataSeparator The character for separating multiple email addresses in the input data.
   * @param bool            $headerIsHtml  If and only if true the header is HTML code.
   */
  public function __construct($header,
                              string $fieldName,
                              string $dataSeparator = ',',
                              bool $headerIsHtml = false)
  {
    parent::__construct('email', $header, $headerIsHtml);

    $this->fieldName     = $fieldName;
    $this->dataSeparator = $dataSeparator;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * {@inheritdoc}
   */
  public function htmlCell(RenderWalker $walker, array $row): string
  {
    $value = $row[$this->fieldName];

    if ($value===null || $value==='')
    {
      $inner = null;
    }
    else
    {
      $addresses = explode($this->dataSeparator, $value);
      $itemClass = $walker->getClasses('email-list-item');
      $list      = [];
      foreach ($addresses as $address)
      {
        $list[] = ['tag'   => 'li',
                   'attr'  => ['class' => $itemClass],
                   'inner' => ['tag'  => 'a',
                               'attr' => ['class' => ['link', 'link-mailto'],
                                          'href'  => 'mailto:'.$address],
                               'text' => $address]];
      }
      $inner = ['tag'   => 'ul',
                'attr'  => ['class' => $walker->getClasses('email-list')],
                'inner' => $list];
    }

    $struct = ['tag'   => 'td',
               'attr'  => ['class' => $walker->getClasses(['cell', 'cell-emails'])],
               'inner' => $inner];

    return Html::htmlNested($struct);
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
