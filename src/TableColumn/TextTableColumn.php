<?php
//----------------------------------------------------------------------------------------------------------------------
namespace SetBased\Abc\Table\TableColumn;

use SetBased\Abc\Helper\Html;

//----------------------------------------------------------------------------------------------------------------------
/**
 * Table column for table cells with plain text.
 */
class TextTableColumn extends TableColumn
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
   * @param string          $fieldName  The field name of the data row used for generating this table column.
   */
  public function __construct($headerText, $fieldName)
  {
    $this->dataType   = 'text';
    $this->headerText = $headerText;
    $this->fieldName  = $fieldName;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * {@inheritdoc}
   */
  public function getHtmlCell($row)
  {
    return '<td>'.Html::txt2Html($row[$this->fieldName]).'</td>';
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
