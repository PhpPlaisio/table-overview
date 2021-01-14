<?php
declare(strict_types=1);

namespace Plaisio\Table\TableColumn;

use Plaisio\Helper\Html;
use Plaisio\Helper\RenderWalker;

/**
 * Table column for table cells with IPv4 addresses.
 */
class Ipv4TableColumn extends UniTableColumn
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
    parent::__construct('ipv4', $header, $headerIsHtml);

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
      $int    = null;
      $string = null;
    }
    else
    {
      if (is_int($value))
      {
        $int    = $value;
        $string = long2ip($value);
      }
      else
      {
        $int    = ip2long($value);
        $string = $value;
      }
    }

    return Html::generateElement('td', ['class' => $walker->getClasses('ipv4'), 'data-value' => $int], $string);
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
