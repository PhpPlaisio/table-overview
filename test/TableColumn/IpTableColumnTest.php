<?php
declare(strict_types=1);

namespace Plaisio\Table\Test\TableColumn;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Plaisio\Helper\RenderWalker;
use Plaisio\Table\TableColumn\IpTableColumn;

/**
 * Test cases for class IpTableColumn.
 */
class IpTableColumnTest extends TestCase
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Data provider for empty values.
   *
   * @return array
   */
  public static function getEmptyValues(): array
  {
    return [[null], ['']];
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Data provider for invalid values.
   *
   * @return array[]
   */
  public static function getInvalidValues(): array
  {
    $cases = [];

    // Plain string.
    $cases[] = ['ip'   => 'not an IP address',
                'html' => 'not an IP address'];

    // String withHTML entities.
    $cases[] = ['ip'   => "&<'\"%s\"'>&",
                'html' => '&amp;&lt;&#039;&quot;%s&quot;&#039;&gt;&amp;'];

    return $cases;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Data provider for valid values.
   *
   * @return array[]
   */
  public static function getValidValues(): array
  {
    $cases = [];

    // IPv4 address as binary(4).
    $cases[] = ['ip'        => inet_pton('127.0.0.1'),
                'dataValue' => '00000000000000000000ffff7f000001',
                'html'      => '127.0.0.1'];

    // IPv4 address as binary(16).
    $cases[] = ['ip'        => inet_pton('::ffff:7f00:1'),
                'dataValue' => '00000000000000000000ffff7f000001',
                'html'      => '127.0.0.1'];

    // IPv4 address as int.
    $cases[] = ['ip'        => 127 * 256 * 256 * 256 + 1,
                'dataValue' => '00000000000000000000ffff7f000001',
                'html'      => '127.0.0.1'];

    // IPv4 address as string.
    $cases[] = ['ip'        => '127.0.0.1',
                'dataValue' => '00000000000000000000ffff7f000001',
                'html'      => '127.0.0.1'];

    // IPv4 address as string in IPv6 notation.
    $cases[] = ['ip'        => '::ffff:7f00:1',
                'dataValue' => '00000000000000000000ffff7f000001',
                'html'      => '127.0.0.1'];

    // IPv6 address as binary(16).
    $cases[] = ['ip'        => inet_pton('fe80::8000:777a:8a39:80bd'),
                'dataValue' => 'fe800000000000008000777a8a3980bd',
                'html'      => 'fe80::8000:777a:8a39:80bd'];

    return $cases;
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test the col element.
   */
  public function testColElement(): void
  {
    $column = new IpTableColumn('header', 'ip');
    $col    = $column->htmlCol();

    self::assertEquals('<col data-type="ip"/>', $col);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with empty values.
   */
  #[DataProvider('getEmptyValues')]
  public function testEmptyValues(mixed $value): void
  {
    $column = new IpTableColumn('header', 'ip');

    $walker = new RenderWalker('ot');
    $row    = ['ip' => $value];
    $ret    = $column->htmlCell($walker, $row);

    self::assertEquals('<td class="ot-cell ot-cell-ip"></td>', $ret, var_export($value, true));
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test data type.
   */
  public function testGetDataType(): void
  {
    $column   = new IpTableColumn('header', 'ip');
    $dataType = $column->getDataType();

    self::assertEquals('ip', $dataType);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with valid values.
   */
  #[DataProvider('getInvalidValues')]
  public function testInvalidValues(mixed $ip, string $html): void
  {
    $column = new IpTableColumn('header', 'ip');

    $walker = new RenderWalker('ot');
    $row    = ['ip' => $ip];
    $ret    = $column->htmlCell($walker, $row);

    $expected = sprintf('<td class="ot-cell ot-cell-ip">%s</td>', $html);
    self::assertEquals($expected, $ret, var_export($ip, true));
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * Test with valid values.
   */
  #[DataProvider('getValidValues')]
  public function testValidValues(mixed $ip, string $dataValue, string $html): void
  {
    $column = new IpTableColumn('header', 'ip');

    $walker = new RenderWalker('ot');
    $row    = ['ip' => $ip];
    $ret    = $column->htmlCell($walker, $row);

    $expected = sprintf('<td class="ot-cell ot-cell-ip" data-value="%s">%s</td>', $dataValue, $html);
    self::assertEquals($expected, $ret, var_export($ip, true));
    self::assertEquals(32, strlen($dataValue));
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
