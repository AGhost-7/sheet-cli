#!/usr/bin/env node

const path = require('path')
const openFile = require('./lib/open-file')
const blessed = require('blessed')
const fs = require('fs')
const table = require('./lib/table')

const formattingMappings = {
	number: (num) => num + '',
	string: (str) => str,
	// TODO: Use momentJs to pretty format dates.
	date: (dt) => dt.toISOString()
}

const formatData = (sheet) => {
	return sheet.rows.map((row) => {
		return row.map((cell) => {
			return formattingMappings[cell.type](cell.value)
		})
	})
}

const display = exports.display = (sheet) => {
	const rows = formatData(sheet)
	const screen = blessed.screen({
		autoPadding: false,
		log: process.env.SHEET_CLI_LOGFILE || path.join(process.env.HOME, '.sheetcli.log'),
		smartCSR: true
	})
	const tbl = table({
		parent: screen,
		rows: rows
	})
	screen.key('q', () => {
		process.exit(0)
	})
	screen.render()
}

const selectSheet = exports.selectSheet = (sheetName, sheets) => {
	if(sheetName) {
		const search = sheetName.toLowerCase().trim()
		const found = sheets.filter((sheet) => {
			return sheet.name.toLowerCase().trim().indexOf(search) > -1;
		})[0]
		if(found) return found
	}
	return sheets[0]
}

const main = exports.main = (process) => {
	const file = process.argv[2]
	const sheets = openFile(path.join(process.cwd(), file))

	display(selectSheet(process.argv[3], sheets) || [])
}

if(require.main === module) {
	main(process)
}

