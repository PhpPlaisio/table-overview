<?php
declare(strict_types=1);

namespace SetBased\Abc\Table\TableColumn;

use SetBased\Abc\Helper\Html;

/**
 * Table column for table cells with email addresses.
 */
class EmailTableColumn extends TableColumn
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * The field name of the data row used for generating this table column.
   *
   * @var string
   */
  protected $fieldName;

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Object constructor.
   *
   * @param string|int|null $headerText The header text of this table column.
   * @param string          $fieldName  The key to be used for getting the value from the data row.
   */
  public function __construct($headerText, string $fieldName)
  {
    parent::__construct('email');

    $this->headerText = $headerText;
    $this->fieldName  = $fieldName;
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
      $html = '<td class="email">';
      $html .= Html::generateElement('a', ['href' => 'mailto:'.$value], $value);
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
