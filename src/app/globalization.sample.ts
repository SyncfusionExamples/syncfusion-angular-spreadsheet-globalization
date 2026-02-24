import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormatOption, SpreadsheetAllModule, SpreadsheetComponent, configureLocalizedFormat, getFormatFromType } from '@syncfusion/ej2-angular-spreadsheet';
import { getDefaultData } from './data';
import { Ajax, L10n, loadCldr, setCulture, setCurrencyCode } from '@syncfusion/ej2-base';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import locale from '../locale.json';

// Centralized config for each selectable locale
const LOCALE_CONFIG: Record<string, {
  culture: string;
  currency: string;
  listSeparator: string;
}> = {
  'de': { culture: 'de', currency: 'EUR', listSeparator: ';' },
  'fr-CH': { culture: 'fr-CH', currency: 'CHF', listSeparator: ';' },
  'zh': { culture: 'zh', currency: 'CNY', listSeparator: ',' },
  'ja': { culture: 'ja', currency: 'JPY', listSeparator: ',' },
  'en-US': { culture: 'en-US', currency: 'USD', listSeparator: ',' },
};

const loadCultureFiles1: (locales: string[]) => void = (locales: string[]): void => {
  const files: string[] = ['ca-gregorian', 'numbers', 'timeZoneNames', 'currencies', 'numberingSystems'];
  locales.forEach((locale: string, index: number) => {
    for (const fileName of files) {
      const url: string = `../../node_modules/@syncfusion/ej2-cldr-data/${fileName === 'numberingSystems' ? 'supplemental' : `main/${locale}`}/${fileName}.json`;
      const ajax: Ajax = new Ajax(url, 'GET', false);
      ajax.onSuccess = (value: string) => {
        loadCldr((value));
      };
      ajax.send();
    }
  });

}

const localeFormats: { [key: string]: FormatOption[] | null } = {
  'ja': [
    { id: 37, code: '#,##0;-#,##0' }, 
    { id: 38, code: '#,##0;[Red]-#,##0' },
    { id: 39, code: '#,##0.00;-#,##0.00' }, 
    { id: 40, code: '#,##0.00;[Red]-#,##0.00' }, 
    { id: 5, code: '"¥"#,##0;-"¥"#,##0' },
    { id: 6, code: '"¥"#,##0;[Red]-"¥"#,##0' }, 
    { id: 7, code: '"¥"#,##0.00;-"¥"#,##0.00' },
    { id: 8, code: '"¥"#,##0.00;[Red]-"¥"#,##0.00' }, 
    { id: 41, code: '_-* #,##0_-;-* #,##0_-;_-* "-"_-;_-@_-' },
    { id: 42, code: '_-"¥"* #,##0_-;-"¥"* #,##0_-;_-"¥"* "-"_-;_-@_-' },
    { id: 43, code: '_-* #,##0.00_-;-* #,##0.00_-;_-* "-"??_-;_-@_-' },
    { id: 44, code: '_-"¥"* #,##0.00_-;-"¥"* #,##0.00_-;_-"¥"* "-"??_-;_-@_-' },
    { id: 14, code: 'yyyy/mm/dd' }, 
    { id: 15, code: 'dd-mmm-yy' }, 
    { id: 16, code: 'dd-mmm' },
    { id: 22, code: 'yyyy/mm/dd h:mm' }
  ],
  'de': [
    { id: 37, code: '#,##0;-#,##0' }, 
    { id: 38, code: '#,##0;[Red]-#,##0' },
    { id: 39, code: '#,##0.00;-#,##0.00' }, 
    { id: 40, code: '#,##0.00;[Red]-#,##0.00' }, 
    { id: 5, code: '#,##0 "€";-#,##0 "€"' },
    { id: 6, code: '#,##0 "€";[Red]-#,##0 "€"' }, 
    { id: 7, code: '#,##0.00 "€";-#,##0.00 "€"' },
    { id: 8, code: '#,##0.00 "€";[Red]-#,##0.00 "€"' }, 
    { id: 41, code: '_-* #,##0_-;-* #,##0_-;_-* "-"_-;_-@_-' },
    { id: 42, code: '_-* #,##0 "€"_-;-* #,##0 "€"_-;_-* "-" "€"_-;_-@_-' },
    { id: 43, code: '_-* #,##0.00_-;-* #,##0.00_-;_-* "-"??_-;_-@_-' },
    { id: 44, code: '_-* #,##0.00 "€"_-;-* #,##0.00 "€"_-;_-* "-"?? "€"_-;_-@_-' },
    { id: 14, code: 'dd.MM.yyyy' }, 
    { id: 15, code: 'dd. MMM yy' }, 
    { id: 16, code: 'dd. MMM' }, 
    { id: 17, code: 'MMM yy' },
    { id: 20, code: 'hh:mm' }, 
    { id: 21, code: 'hh:mm:ss' }, 
    { id: 22, code: 'dd.MM.yyyy hh:mm' }
  ],
  'zh': [
    { id: 37, code: '#,##0;-#,##0' }, 
    { id: 38, code: '#,##0;[Red]-#,##0' }, 
    { id: 39, code: '#,##0.00;-#,##0.00' },
    { id: 40, code: '#,##0.00;[Red]-#,##0.00' }, 
    { id: 5, code: '"¥"#,##0;"¥"-#,##0' }, 
    { id: 6, code: '"¥"#,##0;[Red]"¥"-#,##0' },
    { id: 7, code: '"¥"#,##0.00;"¥"-#,##0.00' }, 
    { id: 8, code: '"¥"#,##0.00;[Red]"¥"-#,##0.00' },
    { id: 41, code: '_ * #,##0_ ;_ * -#,##0_ ;_ * "-"_ ;_ @_' }, 
    { id: 42, code: '_ "¥"* #,##0_ ;_ "¥"* -#,##0_ ;_ "¥"* "-"_ ;_ @_' },
    { id: 43, code: '_ * #,##0.00_ ;_ * -#,##0.00_ ;_ * "-"??_ ;_ @_' },
    { id: 44, code: '_ "¥"* #,##0.00_ ;_ "¥"* -#,##0.00_ ;_ "¥"* "-"??_ ;_ @_ ' },
    { id: 14, code: 'yyyy/m/d' }, 
    { id: 22, code: 'yyyy/m/d h:mm' }
  ],
  'fr-CH': [
    { id: 37, code: '#,##0;-#,##0' }, 
    { id: 38, code: '#,##0;[Red]-#,##0' }, 
    { id: 39, code: '#,##0.00;-#,##0.00' },
    { id: 40, code: '#,##0.00;[Red]-#,##0.00' }, 
    { id: 5, code: '#,##0 "CHF";-#,##0 "CHF"' },
    { id: 6, code: '#,##0 "CHF";[Red]-#,##0 "CHF"' }, 
    { id: 7, code: '#,##0.00 "CHF";-#,##0.00 "CHF"' },
    { id: 8, code: '#,##0.00 "CHF";[Red]-#,##0.00 "CHF"' }, 
    { id: 14, code: 'dd.MM.yyyy' }, 
    { id: 15, code: 'dd.MMM.yy' },
    { id: 16, code: 'dd.MMM' }, 
    { id: 17, code: 'MMM.yy' }, 
    { id: 20, code: 'HH:mm' }, 
    { id: 21, code: 'HH:mm:ss' },
    { id: 22, code: 'dd.MM.yyyy HH:mm' }, 
    { id: 42, code: '_-* #,##0 "CHF"_-;-* #,##0 "CHF"_-;_-* "-" "CHF"_-;_-@_-' },
    { id: 44, code: '_-* #,##0.00 "CHF"_-;-* #,##0.00 "CHF"_-;_-* "-"?? "CHF"_-;_-@_-' },
    { id: 41, code: '_-* #,##0_-;-* #,##0_-;_-* "-"_-;_-@_-' }, 
    { id: 43, code: '_-* #,##0.00_-;-* #,##0.00_-;_-* "-"??_-;_-@_-' }
  ],
  'en-US': null
};

@Component({
  standalone: true,
  imports: [SpreadsheetAllModule],
  selector: 'app-globalization-sample',
  template: `
    <div style="padding: 20px;">
      <h3>Globalization Sample - Custom Number Format and  Dialog Customization</h3>
      <div style="text-align: right; margin-bottom: 5px">
        <select id="locale">
          <option value="de">German - Germany</option>
          <option value="zh">Chinese - China</option>
          <option value="fr-CH">French - Switzerland</option>
          <option value="en-US">English</option>
          <option value="ja">Japanese</option>
        </select>
      </div>
      <ejs-spreadsheet #default [locale]="locale" [listSeparator]="listSeparator"
        [openUrl]="openUrl" [saveUrl]="saveUrl" (created)="created()">
        <e-sheets>
          <e-sheet name="Price Details">
            <e-ranges>
              <e-range [dataSource]="data"></e-range>
            </e-ranges>
            <e-columns>
              <e-column [width]=130></e-column>
              <e-column [width]=92></e-column>
              <e-column [width]=96></e-column>
              <e-column [width]=80></e-column>
              <e-column [width]=80></e-column>
              <e-column [width]=80></e-column>
              <e-column [width]=80></e-column>
              <e-column [width]=80></e-column>
            </e-columns>
          </e-sheet>
        </e-sheets>
      </ejs-spreadsheet>
    </div>
  `
})
export class GlobalizationSample implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('default')
  public spreadsheet!: SpreadsheetComponent;
  
  public data: Object[] = getDefaultData();
  public locale: string = 'de';
  public listSeparator: string = ';';
  public openUrl = 'https://services.syncfusion.com/js/production/api/spreadsheet/open';
  public saveUrl = 'https://services.syncfusion.com/js/production/api/spreadsheet/save';
  private dropDownList!: DropDownList;

  ngOnInit(): void {
    L10n.load(locale);
    loadCultureFiles1(['de', 'fr-CH', 'zh', 'ja']);
    const defaultConfig = LOCALE_CONFIG['de'];
    setCulture(defaultConfig.culture);
    setCurrencyCode(defaultConfig.currency);
    this.listSeparator = defaultConfig.listSeparator;
  }

  ngAfterViewInit(): void {
    this.dropDownList = new DropDownList({
      index: 0,
      width: '150px',
      popupHeight: '200px',
      placeholder: 'Select Locale',
      change: (args: ChangeEventArgs): void => {
        const selectedLocale = args.value as string;
        const config = LOCALE_CONFIG[selectedLocale];
        if (config) {
          setCulture(config.culture);
          setCurrencyCode(config.currency);
          
          const formats = localeFormats[selectedLocale];
          if (formats) {
            configureLocalizedFormat(this.spreadsheet, formats);
          }
          this.locale = config.culture;
          this.listSeparator = config.listSeparator;
          this.spreadsheet.locale = config.culture;
          this.spreadsheet.listSeparator = config.listSeparator;
          setTimeout(() => {
            this.spreadsheet.refresh();
          });
          this.applyFormats();
        }
      }
    }, '#locale');
  }

  created(): void {
    const formats = localeFormats['de']; // Available Locales.
    if (formats) {
      configureLocalizedFormat(this.spreadsheet, formats);
    }
    this.spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
    this.applyFormats();
  }

  applyFormats(): void {
    this.spreadsheet.numberFormat(getFormatFromType('ShortDate'), 'B2:B11');
    this.spreadsheet.numberFormat(getFormatFromType('Time'), 'C2:C11');
    this.spreadsheet.numberFormat(getFormatFromType('Currency'), 'E2:F11');
    this.spreadsheet.numberFormat(getFormatFromType('Percentage'), 'G2:G11');
    this.spreadsheet.numberFormat(getFormatFromType('Accounting'), 'H2:H11');
  }

  ngOnDestroy(): void {
    if (this.dropDownList) {
      this.dropDownList.destroy();
    }
  }
};