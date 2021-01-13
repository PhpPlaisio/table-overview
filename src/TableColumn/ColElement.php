<?php
declare(strict_types=1);

namespace Plaisio\Table\TableColumn;

use Plaisio\Helper\Html;
use Plaisio\Helper\HtmlElement;

/**
 * Class for col elements.
 */
class ColElement
{
  //--------------------------------------------------------------------------------------------------------------------
  use HtmlElement;

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
