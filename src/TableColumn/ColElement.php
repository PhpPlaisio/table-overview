<?php

namespace SetBased\Abc\Table\TableColumn;

use SetBased\Abc\Helper\Html;
use SetBased\Abc\HtmlElement;

/**
 * Class for col elements.
 */
class ColElement extends HtmlElement
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the HTML code for this col element.
   *
   * @return string
   */
  public function getHtmlCol(): string
  {
    return Html::generateVoidElement('col', $this->attributes);
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
