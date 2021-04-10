<?php
declare(strict_types=1);

namespace Plaisio\Table\TableColumn;

use Plaisio\Helper\Html;
use Plaisio\Helper\RenderWalker;

/**
 * Table column for table cells with dates.
 */
class DateTableColumn extends UniTableColumn
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * The default format of the date if the format specifier is omitted in the constructor.
   *
   * @var string
   */
  public static string $defaultFormat = 'd-m-Y';

  /**
   * Many (database) system use a certain value for empty dates or open end dates. Such a value must be shown as an
   * empty table cell.
   *
   * @var string
   */
  public static string $openDate = '9999-12-31';

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
    parent::__construct('date', $header, $headerIsHtml);

    $this->fieldName = $fieldName;
    $this->format    = ($format!==null) ? $format : self::$defaultFormat;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * {@inheritdoc}
   */
  public function getHtmlCell(RenderWalker $walker, array $row): string
  {
    $value = $row[$this->fieldName];

    if ($value===null || $value==='' || $value===self::$openDate)
    {
      $inner = null;
      $data  = null;
    }
    else
    {
      $date = \DateTime::createFromFormat('Y-m-d', $value);
      if (!$date)
      {
        $inner = $value;
        $data  = null;
      }
      else
      {
        $inner = $date->format($this->format);
        $data  = $date->format('Y-m-d');
      }
    }

    return Html::generateElement('td',
                                 ['class'      => $walker->getClasses(['cell', 'date']),
                                  'data-value' => $data],
                                 $inner);
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
