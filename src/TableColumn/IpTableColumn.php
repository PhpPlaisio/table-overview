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
   * @param int|string|null $header       The header text of this table column.
   * @param string          $fieldName    The key to be used for getting the value from the data row.
   * @param bool            $headerIsHtml If and only if true the header is HTML code.
   */
  public function __construct(int|string|null $header, string $fieldName, bool $headerIsHtml = false)
  {
    parent::__construct('ip', $header, $headerIsHtml);

    $this->fieldName = $fieldName;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * {@inheritdoc}
   */
  public function htmlCell(RenderWalker $walker, array $row): string
  {
    $value = $row[$this->fieldName];

    if ($value===null || $value==='')
    {
      $data = null;
      $text = null;
    }
    else
    {
      if (is_int($value))
      {
        $text = long2ip($value);
        $data = bin2hex(inet_pton('::ffff:'.$text));
      }
      else
      {
        switch (true)
        {
          case strlen($value)===4:
            $text = inet_ntop($value);
            $data = '00000000000000000000ffff'.bin2hex($value);
            break;

          case strlen($value)===16:
            $text = inet_ntop($value);
            $data = bin2hex($value);
            if (substr($data, -12, 4)==='ffff')
            {
              $text = substr(strrchr($text, ':'), 1);
            }
            break;

          case preg_match('/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/', $value)===1:
            $text = $value;
            $data = '00000000000000000000ffff'.bin2hex(inet_pton($value));
            break;

          default:
            $bin = inet_pton($value);
            if ($bin!==false)
            {
              $text = inet_ntop($bin);
              $data = bin2hex($bin);
              if (substr($data, -12, 4)==='ffff')
              {
                $text = substr(strrchr($text, ':'), 1);
              }
            }
            else
            {
              $text = $value;
              $data = null;
            }
        }
      }
    }

    $struct = ['tag'  => 'td',
               'attr' => ['class'      => $walker->getClasses(['cell', 'cell-ip']),
                          'data-value' => $data],
               'text' => $text];

    return Html::htmlNested($struct);
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
