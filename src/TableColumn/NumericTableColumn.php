<?php
//----------------------------------------------------------------------------------------------------------------------
namespace SetBased\Abc\Table\TableColumn;

use SetBased\Abc\Helper\Html;

//----------------------------------------------------------------------------------------------------------------------
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
  protected $fieldName;

  /**
   * The format specifier for formatting the content of this table column.
   *
   * @var string
   */
  protected $format;

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Object constructor.
   *
   * @param string|int|null $headerText The header text of this table column.
   * @param string          $fieldName  The key to be used for getting the value from the data row.
   * @param string          $format     The format specifier for formatting the content of this table column. See
   *                                    sprintf.
   */
  public function __construct($headerText, $fieldName, $format = '%d')
  {
    parent::__construct('numeric');

    $this->headerText = $headerText;
    $this->fieldName  = $fieldName;
    $this->format     = $format;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * {@inheritdoc}
   */
  public function getHtmlCell($row)
  {
    $value = $row[$this->fieldName];

    if ($value==false || $value===null || $value==='')
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
    return '<td class="number">'.Html::txt2Html(sprintf($this->format, $value)).'</td>';
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
