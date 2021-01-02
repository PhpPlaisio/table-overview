<?php
declare(strict_types=1);

namespace Plaisio\Table\Walker;

/**
 * Class for walking the row and column tree.
 */
class RenderWalker
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * The CSS module class.
   *
   * @var string
   */
  private string $moduleClass;

  /**
   * The CSS sub-module class.
   *
   * @var string|null
   */
  private ?string $subModuleClass;

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Object constructor.
   *
   * @param string      $moduleClass    The CSS module class.
   * @param string|null $subModuleClass The CSS sub-module class.
   */
  public function __construct(string $moduleClass, ?string $subModuleClass = null)
  {
    $this->moduleClass    = $moduleClass;
    $this->subModuleClass = $subModuleClass;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Returns the module, sub-module and sub-classes for an HTML element.
   *
   * @param string|null $subClass The CSS sub-class with the CSS module class.
   *
   * @return string[]
   */
  public function getClasses(?string $subClass = null): array
  {
    $classes = [];
    if ($this->subModuleClass!==null)
    {
      $classes[] = $this->subModuleClass;
    }
    if ($subClass!==null)
    {
      $classes[] = $this->moduleClass.'-'.$subClass;
    }

    return $classes;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Sets CSS module class of form elements.
   *
   * @param string $moduleClass The CSS module class of form elements.
   *
   * @return $this
   */
  public function setModuleClass(string $moduleClass): self
  {
    $this->moduleClass = $moduleClass;

    return $this;
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
