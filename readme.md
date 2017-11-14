# Sheet-cli
A simple csv and xlsx spreadsheet viewer that works in a similar manner to `less`.

## Usage
This utility relies on the extension name to be either `csv` for a csv file or `xlsx`
for excel documents. Simply specify the file to open as the first argument. If you
are opening an excel file you can specify the name of the sheet to select. Otherwise
it will select the first one in the document.

```
sheet-cli file [sheet]
```

## Hotkeys
Arrow keys work, and at the moment `b` for doing up half a page and `d` for going down
half a page. Scrolling up and down is also supported.

To quit the program, simply press `q`.
