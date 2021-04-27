<?php
declare(strict_types=1);

namespace Plaisio\Table\TableColumn;

use Plaisio\Helper\Html;
use Plaisio\Helper\RenderWalker;

/**
 * Table column for table cells with IPv4 and IPv6 addresses.
 */
class IpTableColumn extends UniTableColumn
{
  //--------------------------------------------------------------------------------------------------------------------
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
   * @param string|int|null $header       The header text of this table column.
   * @param string          $fieldName    The key to be used for getting the value from the data row.
   * @param bool            $headerIsHtml If and only if true the header is HTML code.
   */
  public function __construct($header, string $fieldName, bool $headerIsHtml = false)
  {
    parent::__construct('ip', $header, $headerIsHtml);

    $this->fieldName = $fieldName;
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
      $data   = null;
      $string = null;
    }
    else
    {
      if (is_int($value))
      {
        $string = long2ip($value);
        $data   = bin2hex(inet_pton('::ffff:'.$string));
      }
      else
      {
        $string = inet_ntop($value);
        $data   = bin2hex($value);
        if (substr($data, -12, 4)==='ffff')
        {
          $string = substr(strrchr($string, ':'), 1);
        }
      }
    }

    return Html::generateElement('td',
                                 ['class'      => $walker->getClasses(['cell', 'ip']),
                                  'data-value' => $data],
                                 $string);
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
