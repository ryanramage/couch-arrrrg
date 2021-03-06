tablesorter is a jQuery plugin for turning a standard HTML table with THEAD and TBODY tags into a sortable table without page refreshes.
tablesorter can successfully parse and sort many types of data including linked data in a cell.

### Documentation

* See the [full documentation](http://mottie.github.com/tablesorter/docs/).


### Usage

```
jam install tablesorter
```

```javascript

define('js/app',['jquery','tablesorter'], function($){
    $('table').tablesorter();
});

```

__Note:__ You need to add 'tablesorter' to the array, but do not need to have it as an actual parameter to your function.


Currently the tablesorter widget system and other addons have not been included in this amd port.



### Features

* Multi-column sorting.
* Multi-tbody sorting - see the [options](http://mottie.github.com/tablesorter/docs/index.html#options) table on the main document page.
* Parsers for sorting text, alphanumeric text, URIs, integers, currency, floats, IP addresses, dates (ISO, long and short formats) &amp; time. [Add your own easily](http://mottie.github.com/tablesorter/docs/example-parsers.html).
* Support for ROWSPAN and COLSPAN on TH elements.
* Support secondary "hidden" sorting (e.g., maintain alphabetical sort when sorting on other criteria).
* Extensibility via [widget system](http://mottie.github.com/tablesorter/docs/example-widgets.html).
* Cross-browser: IE 6.0+, FF 2+, Safari 2.0+, Opera 9.0+.
* Small code size.
* Works with jQuery 1.2.6+.

### Licensing

* Copyright (c) 2007 Christian Bach.
* Original examples and docs at: [http://tablesorter.com](http://tablesorter.com).
* Dual licensed under the [MIT](http://www.opensource.org/licenses/mit-license.php) and [GPL](http://www.gnu.org/licenses/gpl.html) licenses.

### Change Log

View the [complete listing here](https://github.com/Mottie/tablesorter/wiki/Change).

#### Version 2.3.8 (6/5/2012)

* Filter widget search will now update on table updates. Fix for [issue #86](https://github.com/Mottie/tablesorter/issues/86).
* Fixed errors when entering invalid regex into the filter widget search input. Fix for [issue #87](https://github.com/Mottie/tablesorter/issues/87).
* Removed unnecessary semi-colons from the unicode characters in the [sorting accented characters demo](http://mottie.github.com/tablesorter/docs/example-locale-sort.html).
* Added a [Language](https://github.com/Mottie/tablesorter/wiki/Language) wiki page which contains the character equivalent code for different languages (well only for Polish so far).

#### Version 2.3.7 (6/3/2012)

* Updated `$.tablesorter.replaceAccents()` function to be independent of the table.
  * It was originally table dependent to allow making tables with different languages. I'll have to add another table option to allow this, if the need arises.
  * Modified as suggested in [issue #81](https://github.com/Mottie/tablesorter/issues/81).
* Fixed the `url` parser `is` function to properly detect complete urls.
* Fixed an issue with the `updateCell` method incorrectly targeting the cell when there was more than one row in the header. Fix for [issue #83](https://github.com/Mottie/tablesorter/issues/83).

#### Version 2.3.6 (6/1/2012)

* Made the following enhancements to the filter widget:
  * Include placeholder text in the filter input boxes by adding `data-placeholder` with the text to the header cell; e.g. `data-placeholder="First Name"`. See the examples in the [filter widget demo](http://mottie.github.com/tablesorter/docs/example-widget-filter.html).
  * Exact match added. Add a quote (single or double) to the end of the string to find an exact match. In the first column enter `Clark"` to only find "Clark" and not "Brandon Clark".
  * Wild cards added:
     * `?` (question mark) finds any single non-space character.<br>In the discount column, adding `1?%` in the filter will find all percentages between "10%" and "19%". In the last column, `J?n` will find "Jun" and "Jan".
     * `*` (asterisk) finds multiple non-space characters.<br>In the first column below Enter `Br*` will find multiple names starting with "Br". Now add a space at the end, and "Bruce" will not be included in the results.
  * Regex added. Search columns using regex. For example enter `/20[^0]\d/` in the last column to find all date greater than 2009.
  * Added `filter_functions` option which allows you to add a select dropdown to the specified column that either gathers the options from the column contents or obtains options from custom function settings. Additionally, you can use this option to apply a custom filter function to the column. For more details, see the new [custom filter widget demo](http://mottie.github.com/tablesorter/docs/example-widget-filter-custom.html).

#### Version 2.3.5 (5/28/2012)

* Fixed colspan in header causing javascript errors and metadata issues. Fix for [issue #78](https://github.com/Mottie/tablesorter/issues/78).
* Fixed Chrome "Uncaught RangeError" issue. Fix for [issue #70](https://github.com/Mottie/tablesorter/issues/70).
* Added more optimizations to speed up IE (except IE7):
  * Hide tbody during manipulation - added "tablesorter-hidden" css definition.
  * Parsing of the table contents using `textContent` for modern browsers (including IE9); see [this jsperf](http://jsperf.com/read-innerhtml-vs-innertext-vs-nodevalue-vs-textcontent).
  * Columns widget.
  * Filter widget.
  * Zebra widget.
* Updated the shortDate detection regex to look for two or four grouped digits instead of two through four digits. Fix for [issue #76](https://github.com/Mottie/tablesorter/issues/76).
* Widget updates:
  * Added `initWidgets` option
     * If `true`, all selected widgets (from the `widgets` option) will be applied after the table has initialized.
     * when `false`, selected widgets `init` function will be called, but not the `format` function. So none of the widget formating will be applied to the table. Note: almost all included widgets do not use the `init` function to keep backward compatibility, except for the `saveSort` widget in which the `init` function immediately calls the `format` function. This information is only important if you are writing a custom widget.
     * It would be useful to set this option to false if using the pager plugin along with a very large table, say 1000+ rows. The table will be initialized, but no widgets are applied. Then the pager plugin is called and the table is modified and all of the widgets are applied when completed. So essentially this saves time by only running the widgets once.
     * Modified the pager plugin to make sure it doesn't apply widgets more than once.
  * Added filter widget option `filter_ignoreCase`:
     * The default setting is `true` and all searches will be case insensitive.
     * Set this option to `false` to make the searches case sensitive.
  * Added filter widget option `filter_searchDelay`:
     * Default set to 300 milliseconds.
     * This is the delay before the filter widget starts searching.
     * This option prevents searching for every character while typing and should make searching large tables faster.
  * Resizable widget will no longer initialize a sort after releasing the mouse.
  * Updated ui theme css to remove bold fonts from odd rows.

#### Version 2.3.4 (5/20/2012)

* Added selector change suggested by [AnthonyM1229](https://github.com/AnthonyM1229) in [issue #74](https://github.com/Mottie/tablesorter/issues/74#issuecomment-5806832) to fix IE8 ignoring class name parsers. Thanks again Anthony for all of your hard work and input!

#### Version 2.3.3 (5/19/2012)

* Fixed the method used to get data from jQuery data, meta data, header options or header class names.
  * This should fix the "filter-false" problem reported in [issue #73](https://github.com/Mottie/tablesorter/issues/73),
  * and fix [issue #74](https://github.com/Mottie/tablesorter/issues/74) with setting parsers by class name.
* Performance improvements:
  * Modified the zebra and columns widget to use document fragments to modify changes to the table. I didn't log all of the times, but there was a speed increase in reported time when using the [triggered events](http://mottie.github.com/tablesorter/docs/example-triggers.html) demo (1022 rows).
  * Changed the `shortDate` parser to cache header information.
* Updated multiple demos to show how to set some options using jQuery data, class names, etc.
  * [Date format](http://mottie.github.com/tablesorter/docs/example-option-date-format.html).
  * [Lock sort order](http://mottie.github.com/tablesorter/docs/example-options-headers-locked.html).
  * [Initial sort order](http://mottie.github.com/tablesorter/docs/example-options-headers-order.html).
  * [Set parser by class name](http://mottie.github.com/tablesorter/docs/example-parsers-class-name.html).
  * [Disable filter widget](http://mottie.github.com/tablesorter/docs/example-widget-filter.html). NOTE: this widget uses the `getData()` function that doesn't exist in the original tablesorter.

#### Version 2.3.2 (5/11/2012)

* Added a method to remove tablesorter from a table
  * Use `$('table').trigger('destroy');` to remove it.
  * Some classes applied by widgets will remain (zebra, columns, etc); but the functionality will be removed. I've been thinking about adding a "remove" function to each widget to specifically remove that widget.
  * Rows hidden by the filter widget will not reappear. I may work on an option to fix that in the future.
  * The "tablesorter" class is removed from the table; but if you want to leave this class, then use this example: `$('table').trigger('destroy', [false]);`.
* Fixed percent parser to not be automatically applied to text columns. Fix for [issue #67](https://github.com/Mottie/tablesorter/issues/67).
* Fixed filter widget not working in v2.3.1. It was actually a problem with getting jQuery data breaking the widget. 
* The first tbody can now be an info block.
  * Change suggested by [kristerkari](https://github.com/kristerkari) in [pull request #68](https://github.com/Mottie/tablesorter/pull/68).
  * Updated [multiple tbodies demo](http://mottie.github.com/tablesorter/docs/example-multiple-tbodies.html).
* The zebra and column widgets should now properly ignore info blocks (it was missing periods in the class selectors!).
* Text extracted from table cells is now automatically trimmed of extra spaces, tabs and carriage returns. If these elements are important to you, then please refer to the [advanced use custom parser demo](http://mottie.github.com/tablesorter/docs/example-parsers-advanced.html) which allows you to access the table cell `$(cell)` directly.
* Fixed and/or updated a bunch of demos:
  * Demos that include jQuery UI seem to need jQuery v1.4+ now or script errors will completely break the plugin. Updated ui theme and sticky headers widget demos.
  * Render headers demo now targets the div wrapping header cell contents. Previously it was a span.
