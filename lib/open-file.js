'use strict'

const csvParse = require('csv-parse/lib/sync')
const XLSX = require('xlsx')
const fs = require('fs')
const path = require('path')

const letters = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');

const xlsxTypeMappings = {
	n: 'number',
	s: 'string',
	d: 'date',
	b: 'boolean'
}

const convertXlsxCell = exports.convertXlsxCell = (cell) => {
	return {
		value: cell.v,
		type: xlsxTypeMappings[cell.t]
	}
}

const convertXlsxRow = exports.convertXlsxRow = (sheet, index) => {
	let letter, row = []
	for(let l = 0; l < letters.length; l++) {
		letter = letters[l]
		const location = letter + index
		const cell = sheet[location]
		if(cell === undefined) {
			row.push({
				type: 'string',
				value: ''
			})
		} else {
			row.push(convertXlsxCell(cell))
		}
	}
	return row
}

const openFileXlsx = exports.openFileXlsx = (absPath) => {
	const workbook = XLSX.readFile(absPath)
	return workbook
		.SheetNames
		.filter((name) => !/^[!]/.test(name))
		.map((name) => {
			let index = 0
			let sheet = workbook.Sheets[name]
			const rows = []
			while(sheet['A' + (++index)]) {
				rows.push(convertXlsxRow(sheet, index))
			}

			return {
				name,
				rows
			}
		})
}

const openFileCsv = (absPath) => {
	const contents = fs.readFileSync(absPath)
	const csvRows = csvParse(contents, { auto_parse: true, auto_parse_date: true })

	const rows = csvRows.map((row) => {
		return row.map((value) => {
			const type = value instanceof Date ? 'date' : typeof value;
			return {
				type,
				value
			}
		})
	})

	const name = path.basename(absPath)

	return [{
		rows,
		name
	}]
}

module.exports = (absPath) => {
	switch(path.extname(absPath)) {
		case '.xlsx':
			return openFileXlsx(absPath)
		case '.csv':
			return openFileCsv(absPath)
		default:
			console.error('Invalid extension')
			process.exit(1)
	}
}

