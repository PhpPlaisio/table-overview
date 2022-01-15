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
  public function htmlCol(): string
  {
    return Html::htmlNested(['tag'  => 'col',
                             'attr' => $this->attributes]);
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
