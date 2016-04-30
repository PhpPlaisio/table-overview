<?php
//----------------------------------------------------------------------------------------------------------------------
namespace SetBased\Abc\Table\TableColumn;

use SetBased\Abc\Helper\Html;

//----------------------------------------------------------------------------------------------------------------------
/**
 * Table column for table cells with dates.
 */
class DateTableColumn extends TableColumn
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * The default format of the date if the format specifier is omitted in the constructor.
   *
   * @var string
   */
  public static $defaultFormat = 'd-m-Y';

  /**
   * Many (database) system use a certain value for empty dates or open end dates. Such a value must be shown as an
   * empty table cell.
   *
   * @var string
   */
  public static $openDate = '9999-12-31';

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
   * @param string          $fieldName  The field name of the data row used for generating this table column.
   * @param string|null     $format     The format specifier for formatting the content of this table column. If null
   *                                    the default format is used.
   */
  public function __construct($headerText, $fieldName, $format = null)
  {
    $this->dataType   = 'date';
    $this->headerText = $headerText;
    $this->fieldName  = $fieldName;
    $this->format     = ($format) ? $format : self::$defaultFormat;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * {@inheritdoc}
   */
  public function getHtmlCell($row)
  {
    $value = $row[$this->fieldName];

    if ($value!==false && $value!==null && $value!=='' && $row[$this->fieldName]!=self::$openDate)
    {
      $date = \DateTime::createFromFormat('Y-m-d', $row[$this->fieldName]);

      if ($date)
      {
        $cell = '<td class="date" data-value="';
        $cell .= $date->format('Y-m-d');
        $cell .= '">';
        $cell .= Html::txt2Html($date->format($this->format));
        $cell .= '</td>';

        return $cell;
      }
      else
      {
        // The $data[$this->fieldName] is not a valid date.
        return '<td>'.Html::txt2Html($row[$this->fieldName]).'</td>';
      }
    }
    else
    {
      // The value is an empty date.
      return '<td class="date"></td>';
    }
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
