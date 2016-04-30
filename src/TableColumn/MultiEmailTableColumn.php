<?php
//----------------------------------------------------------------------------------------------------------------------
namespace SetBased\Abc\Table\TableColumn;

use SetBased\Abc\Helper\Html;

//----------------------------------------------------------------------------------------------------------------------
/**
 * Table column for table cells with multiple email addresses.
 */
class MultiEmailTableColumn extends TableColumn
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * The character for separating multiple email addresses in the input data.
   *
   * @var string
   */
  protected $dataSeparator;

  /**
   * The field name of the data row used for generating this table column.
   *
   * @var string
   */
  protected $fieldName;

  /**
   * The character for separating multiple email addresses  in the generated HTML code.
   *
   * @var string
   */
  protected $htmlSeparator;

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Object constructor.
   *
   * @param string|int|null $headerText     The header text of this table column.
   * @param string          $fieldName      The field name of the data rows used for generating this table column.
   * @param string          $dataSeparator  The character for separating multiple email addresses in the input data.
   * @param string          $htmlSeparator  The HTML snippet for separating multiple email addresses in the generated
   *                                        HTML code.
   */
  public function __construct($headerText, $fieldName, $dataSeparator = ',', $htmlSeparator = '<br/>')
  {
    $this->dataType      = 'email';
    $this->headerText    = $headerText;
    $this->fieldName     = $fieldName;
    $this->dataSeparator = $dataSeparator;
    $this->htmlSeparator = $htmlSeparator;
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
      // Value has 1 or more mail addresses.
      $addresses = explode($this->dataSeparator, $value);

      $html = '<td class="email">';
      foreach ($addresses as $i => $address)
      {
        if ($i) $html .= $this->htmlSeparator;
        $address = Html::txt2Html($address);

        $html .= '<a href="mailto:';
        $html .= $address;
        $html .= '">';
        $html .= $address;
        $html .= '</a>';
      }
      $html .= '</td>';

      return $html;
    }
    else
    {
      // The value is empty.
      return '<td></td>';
    }
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
