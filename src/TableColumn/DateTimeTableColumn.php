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
  public static string $defaultFormat = 'd-m-Y H:i:s';

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
   * @param string|null     $format       The format specifier for formatting the content of this table column. If null
   *                                      the default format is used.
   * @param bool            $headerIsHtml If and only if true the header is HTML code.
   */
  public function __construct($header, string $fieldName, ?string $format = null, bool $headerIsHtml = false)
  {
    parent::__construct('datetime', $header, $headerIsHtml);

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

    if ($value===null || $value==='')
    {
      // The value is empty.
      return '<td></td>';
    }

    $datetime = \DateTime::createFromFormat('Y-m-d H:i:s', $row[$this->fieldName]);
    if (!$datetime)
    {
      // The value is not a valid datetime.
      return '<td>'.Html::txt2Html($row[$this->fieldName]).'</td>';
    }

    return Html::generateElement('td',
                                 ['class' => 'datetime', 'data-value' => $datetime->format('Y-m-d H:i:s')],
                                 $datetime->format($this->format));
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
