# Sheet-cli
A simple csv and xlsx spreadsheet viewer that works in a similar manner to `less`.

## How to install
```
npm install --global sheet-cli
```

## Usage
This utility relies on the extension name to be either `csv` for a csv file or `xlsx`
for excel documents. Simply specify the file to open as the first argument. If you
are opening an excel file you can specify the name of the sheet to select. Otherwise
it will select the first one in the document.

```
sheet-cli file [sheet]
```
