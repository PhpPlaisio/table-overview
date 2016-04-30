<?php
//----------------------------------------------------------------------------------------------------------------------
namespace SetBased\Abc\Table\TableColumn;

use SetBased\Abc\Helper\Html;

//----------------------------------------------------------------------------------------------------------------------
/**
 * Table column for table cells with dates and times.
 */
class DateTimeTableColumn extends TableColumn
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * The default format of the date-time if the format specifier is omitted in the constructor.
   *
   * @var string
   */
  public static $defaultFormat = 'd-m-Y H:i:s';

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
    $this->dataType   = 'datetime';
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

    if ($value!==false && $value!==null && $value!=='')
    {
      $datetime = \DateTime::createFromFormat('Y-m-d H:i:s', $row[$this->fieldName]);

      if ($datetime)
      {
        $cell = '<td class="datetime" data-value="';
        $cell .= $datetime->format('Y-m-d H:i:s');
        $cell .= '">';
        $cell .= Html::txt2Html($datetime->format($this->format));
        $cell .= '</td>';

        return $cell;
      }
      else
      {
        // The value is not a valid datetime.
        return '<td>'.Html::txt2Html($row[$this->fieldName]).'</td>';
      }
    }
    else
    {
      // The value is an empty datetime.
      return '<td class="datetime"></td>';
    }
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
