<?php
declare(strict_types=1);

namespace Plaisio\Table\TableColumn;

use Plaisio\Helper\Html;
use Plaisio\Helper\RenderWalker;

/**
 * Table column for table cells with numbers.
 */
class NumberTableColumn extends UniTableColumn
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * The field name of the data row used for generating this table column.
   *
   * @var string
   */
  protected string $fieldName;

  /**
   * The format specifier for formatting the content of this table column.
   *
   * @var string
   */
  protected string $format;

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Object constructor.
   *
   * @param string|int|null $header       The header text of this table column.
   * @param string          $fieldName    The key to be used for getting the value from the data row.
   * @param string          $format       The format specifier for formatting the content of this table column. See
   *                                      sprintf.
   * @param bool            $headerIsHtml If and only if true the header is HTML code.
   */
  public function __construct($header, string $fieldName, string $format = '%d', bool $headerIsHtml = false)
  {
    parent::__construct('number', $header, $headerIsHtml);

    $this->fieldName = $fieldName;
    $this->format    = $format;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * {@inheritdoc}
   */
  public function htmlCell(RenderWalker $walker, array $row): string
  {
    $value = $row[$this->fieldName];

    if (is_numeric($value))
    {
      $text = sprintf($this->format, $value);
      $data = $value;
    }
    else
    {
      $text = $value;
      $data = null;
    }

    $struct = ['tag'  => 'td',
               'attr' => ['class'      => $walker->getClasses(['cell', 'number']),
                          'data-value' => $data],
               'text' => $text];

    return Html::htmlNested($struct);
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
