<?php
declare(strict_types=1);

namespace Plaisio\Table\TableColumn;

use Plaisio\Helper\Html;
use Plaisio\Table\Walker\RenderWalker;

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
   * @param string|int|null $header         The header text of this table column.
   * @param string          $fieldName      The key to be used for getting the value from the data row.
   * @param string          $dataSeparator  The character for separating multiple email addresses in the input data.
   * @param bool            $headerIsHtml   If and only if true the header is HTML code.
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
  public function getHtmlCell(RenderWalker $walker, array $row): string
  {
    $value = $row[$this->fieldName];

    if ($value===null || $value==='')
    {
      $inner = null;
    }
    else
    {
      $addresses = explode($this->dataSeparator, $value);
      $inner     = Html::generateTag('span', ['class' => $walker->getClasses('email-list')]);
      foreach ($addresses as $i => $address)
      {
        $inner .= Html::generateElement('a', ['href' => 'mailto:'.$address], $address);
      }
      $inner .= '</span>';
    }

    return Html::generateElement('td', ['class' => $walker->getClasses('emails')], $inner, true);
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
