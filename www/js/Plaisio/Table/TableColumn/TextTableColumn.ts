import {Cast} from '../../Helper/Cast';
import {OverviewTable} from '../OverviewTable';
import {TableColumn} from './TableColumn';

/**
 * Table column for generic text.
 */
export class TextTableColumn implements TableColumn
{
  //--------------------------------------------------------------------------------------------------------------------
  /**
   * The form control (type text) filter.
   */
  protected $input: JQuery = $();

  /**
   * The value for filtering.
   */
  protected filter: string = '';

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  public compareSortKeys(value1: any, value2: any): number
  {
    const val1: string = (typeof value1 === 'string') ? value1 : '';
    const val2: string = (typeof value1 === 'string') ? value1 : '';

    if (val1 < val2)
    {
      return -1;
    }

    if (val1 > val2)
    {
      return 1;
    }

    return 0;
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
  public getSortKey(tableCell: HTMLTableCellElement): any
  {
    return OverviewTable.toLowerCaseNoDiacritics($(tableCell).text());
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  public initColumn(table: OverviewTable, columnIndex: number): void
  {
    // Nothing to do.
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  public initFilter(table: OverviewTable, columnIndex: number, mq: MediaQueryList): void
  {
    const that = this;

    this.$input = table.$filters.eq(columnIndex).find('input');

    // Clear the filter box (some browsers preserve the values on page reload).
    this.$input.val('');

    // Install event handler for ESC-key pressed in filter.
    this.$input.on('keyup', function (event: JQuery.KeyUpEvent)
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
  public initSort(table: OverviewTable, index: number): void
  {
    const that = this;

    // Install event handler for click on sort icon.
    let $header = table.$headers.eq(table.headerIndexLookup[index]);

    if ($header.hasClass('sort'))
    {
      $header.on('click', function (event: JQuery.ClickEvent)
      {
        table.sort(event, $header, that, index);
      });
    }
    else if ($header.hasClass('sort-1') || $header.hasClass('sort-2'))
    {
      $header.on('click', function (event: JQuery.TriggeredEvent)
      {
        if ($header.hasClass('sort-1') && $header.hasClass('sort-2'))
        {
          let widthCol1 = 0;
          let widthCol2 = 0;
          let x: number = 0;
          const offset  = $header.offset();

          if (event.pageX && offset)
          {
            x = event.pageX - offset.left;
          }

          if (table.headerIndexLookup[index] === table.headerIndexLookup[index - 1])
          {
            widthCol1 = table.columnWidth(index - 1);
            widthCol2 = table.columnWidth(index);
          }

          if (table.headerIndexLookup[index] === table.headerIndexLookup[index + 1])
          {
            widthCol1 = table.columnWidth(index);
            widthCol2 = table.columnWidth(index + 1);
          }

          const widthHeader: number = $header.outerWidth() || 0;
          const diff: number        = widthHeader - widthCol1 - widthCol2;

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
  public mediaChange(mq: MediaQueryList): void
  {
    this.$input.width('');

    if (mq || (mq as any).matches === false)
    {
      // Large screen.
      this.$input.width((this.$input.width() || 0) +
        ((this.$input.closest('td').innerWidth() || 0) -
          (this.$input.outerWidth(true) || 0)));
    }
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  public simpleFilter(tableCell: HTMLTableCellElement): boolean
  {
    const value = this.extractForFilter(tableCell);

    return (value.indexOf(this.filter) !== -1);
  }

  //--------------------------------------------------------------------------------------------------------------------
  /**
   * @inheritDoc
   */
  public startFilter(): boolean
  {
    this.filter = OverviewTable.toLowerCaseNoDiacritics(Cast.toManString(this.$input.val(), ''));

    return (this.filter !== '');
  }

  //--------------------------------------------------------------------------------------------------------------------
}

//----------------------------------------------------------------------------------------------------------------------
OverviewTable.registerTableColumn('text', TextTableColumn);
OverviewTable.registerTableColumn('email', TextTableColumn);
