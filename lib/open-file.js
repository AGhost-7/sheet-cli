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

const xlsxType = (cell) => {
	if(cell.t === 's') return 'string'
	if(cell.t === 'b') return 'boolean'
	if(cell.t === 'n') {
		if(cell.w) {
			if(cell.w.toLowerCase() === 'true' || cell.w.toLowerCase() === 'false') {
				return 'boolean'
			}
			if(/^[0-9]{4}\/[0-9]{1,2}\/[0-9]{1,2}$/.test(cell.w)) {
				return 'date'
			}
			if(typeof cell.v === 'number') {
				return 'number'
			}
		}
	}

	// Fallback to string just in case.
	return 'string'
}

const xlsxValue = (cell, type) => {
	switch(type) {
			case 'date':
				return cell.w
			case 'string':
				return cell.v
			case 'number':
				return cell.v
			case 'boolean':
				return !!cell.v
	}
}

const convertXlsxCell = exports.convertXlsxCell = (cell) => {
	const type = xlsxType(cell)
	const value = xlsxValue(cell, type)
	return {
		value,
		type
	}
}

const rowLength = (sheet, index) => {
	for(let lIndex = letters.length - 1; lIndex >= 0; lIndex--) {
		const letter = letters[lIndex]
		const location = letter + index
		const cell = sheet[location]
		if(cell !== undefined) {
			return lIndex + 1
		}
	}
	return 0
}

const convertXlsxRow = exports.convertXlsxRow = (sheet, index) => {
	let letter,
		row = [],
		length = rowLength(sheet, index)
	for(let l = 0; l < length; l++) {
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

