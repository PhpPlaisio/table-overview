import {OverviewTable} from "../OverviewTable";
import {TableColumn} from "./TableColumn";

/**
 * Table column for generic text.
 */
export class TextTableColumn implements TableColumn
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * The form control (type text) filter.
   */
  protected $input: JQuery;

  /**
   * The value for filtering.
   */
  protected filter: string;

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  public startFilter(): boolean
  {
    this.filter = OverviewTable.toLowerCaseNoDiacritics(<string>this.$input.val());

    // Note: this.filterValue might be undefined in case there is no input:text box for filtering in the column
    // header.

    return (this.filter && this.filter !== '');
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  public simpleFilter(tableCell: HTMLTableCellElement): boolean
  {
    let value = this.extractForFilter(tableCell);

    return (value.indexOf(this.filter) !== -1);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  public initSort(table: OverviewTable, index: number): void
  {
    let that = this;
    let widthCol1: number = 0;
    let widthCol2: number = 0;

    // Install event handler for click on sort icon.
    let $header = table.$headers.eq(table.headerIndexLookup[index]);

    if ($header.hasClass('sort'))
    {
      $header.on('click', function (event)
      {
        table.sort(event, $header, that, index);
      });
    }
    else if ($header.hasClass('sort-1') || $header.hasClass('sort-2'))
    {
      $header.on('click', function (event)
      {
        if ($header.hasClass('sort-1') && $header.hasClass('sort-2'))
        {
          let x = event.pageX - $header.offset().left;

          if (table.headerIndexLookup[index] === table.headerIndexLookup[index - 1])
          {
            widthCol1 = table.$table.children('tbody').children('tr:visible:first')
              .find('td:eq(' + (index - 1) + ')').outerWidth();
            widthCol2 = table.$table.children('tbody').children('tr:visible:first')
              .find('td:eq(' + index + ')').outerWidth();
          }

          if (table.headerIndexLookup[index] === table.headerIndexLookup[index + 1])
          {
            widthCol1 = table.$table.children('tbody').children('tr:visible:first')
              .find('td:eq(' + index + ')').outerWidth();
            widthCol2 = table.$table.children('tbody').children('tr:visible:first')
              .find('td:eq(' + (index + 1) + ')').outerWidth();
          }

          let widthHeader: number = $header.outerWidth();
          let diff: number = widthHeader - widthCol1 - widthCol2;

          if (x > (widthCol1 - diff / 2))
          {
            if (table.headerIndexLookup[index] ===
              table.headerIndexLookup[index - 1])
            {
              // Sort by right column.
              table.sort(event, $header, that, index);
            }
          }
          else if (x < (widthCol1 + diff / 2))
          {
            if (table.headerIndexLookup[index] === table.headerIndexLookup[index + 1])
            {
              // Sort by left column.
              table.sort(event, $header, that, index);
            }
          }
        }
        else if ($header.hasClass('sort-1'))
        {
          table.sort(event, $header, that, index);
        }
        else if ($header.hasClass('sort-2'))
        {
          table.sort(event, $header, that, index);
        }
      });
    }
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  public initFilter(table: OverviewTable, columnIndex: number, mq: MediaQueryList): void
  {
    let that = this;

    this.$input = table.$filters.eq(columnIndex).find('input');

    // Clear the filter box (some browsers preserve the values on page reload).
    this.$input.val('');

    // Install event handler for ESC-key pressed in filter.
    this.$input.on('keyup', function (event)
    {
      // If the ESC-key was pressed or nothing is entered clear the value of the search box.
      if (event.key === 'Escape')
      {
        that.$input.val('');
      }
    });

    // Install event handler for changed filter value.
    this.$input.on('keyup', {table: table, element: this.$input}, table.filterTrigger);

    this.mediaChange(mq);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  public mediaChange(mq: MediaQueryList): void
  {
    this.$input.width('');

    if (mq || mq.matches === false)
    {
      // Large screen.
      this.$input.width(this.$input.width() +
        (this.$input.closest('td').innerWidth() - this.$input.outerWidth(true)));
    }
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  public extractForFilter(tableCell: HTMLTableCellElement): string
  {
    return OverviewTable.toLowerCaseNoDiacritics($(tableCell).text());
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  public getSortKey(tableCell): string
  {
    return OverviewTable.toLowerCaseNoDiacritics($(tableCell).text());
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  public compareSortKeys(value1: string, value2: string): number
  {
    if (value1 < value2)
    {
      return -1;
    }

    if (value1 > value2)
    {
      return 1;
    }

    return 0;
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
OverviewTable.registerTableColumn('text', TextTableColumn);
OverviewTable.registerTableColumn('email', TextTableColumn);
