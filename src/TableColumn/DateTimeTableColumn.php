<?php
declare(strict_types=1);

namespace Plaisio\Table\TableColumn;

use Plaisio\Helper\Html;

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
   * @param string          $fieldName  The key to be used for getting the value from the data row.
   * @param string|null     $format     The format specifier for formatting the content of this table column. If null
   *                                    the default format is used.
   */
  public function __construct($headerText, string $fieldName, ?string $format = null)
  {
    parent::__construct('datetime', $headerText);

    $this->fieldName = $fieldName;
    $this->format    = ($format!==null) ? $format : self::$defaultFormat;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * {@inheritdoc}
   */
  public function getHtmlCell(array $row): string
  {
    $value = $row[$this->fieldName];

    if ($value!==false && $value!==null && $value!=='')
    {
      $datetime = \DateTime::createFromFormat('Y-m-d H:i:s', $row[$this->fieldName]);

      if ($datetime)
      {
        return Html::generateElement('td',
                                     ['class' => 'datetime', 'data-value' => $datetime->format('Y-m-d H:i:s')],
                                     $datetime->format($this->format));
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
