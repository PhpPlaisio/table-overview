<?php
declare(strict_types=1);

namespace Plaisio\Table\TableColumn;

use Plaisio\Helper\Html;

/**
 * Table column for table cells with numbers.
 */
class NumericTableColumn extends TableColumn
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
    parent::__construct('numeric', $header, $headerIsHtml);

    $this->fieldName = $fieldName;
    $this->format    = $format;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * {@inheritdoc}
   */
  public function getHtmlCell(array $row): string
  {
    $value = $row[$this->fieldName];

    if ($value===null || $value==='')
    {
      // The value is empty.
      return '<td></td>';
    }

    if (!is_numeric($value))
    {
      // Value is not numeric. Just show the value as is.
      return '<td>'.Html::txt2Html($value).'</td>';
    }

    // Value is a number. Use the format specifier for showing the value.
    return Html::generateElement('td', ['class' => 'number', 'data-value' => $value], sprintf($this->format, $value));
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
