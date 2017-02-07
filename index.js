#!/usr/bin/env node

// TODO:
// - handle csv and other formats? this is why I'm translating the xlsx lib.
// - use something like blessedJs for handling display.

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
		if(cell === undefined) break
		row.push(convertXlsxCell(cell))
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

const formattingMappings = {
	number: (num) => num + '',
	string: (str) => str,
	// TODO: Use momentJs to pretty format dates.
	date: (dt) => dt.toISOString()
}

// This is used to determine the width of the rows
const scanMaximums = (formattedRow) => {
	return formattedRow.reduce((accu, row) => {
		row.forEach((cell, ind) => {
			accu[ind] = Math.max(cell.length, accu[ind] || 0)
		})
		return accu;
	}, {})
}

const spaces = (times) => {
	let str = ''
	while(times--) str += ' '
	return str
}

const display = exports.display = (sheet) => {
	const formatted = sheet.rows.map((row) => {
		return row.map((cell) => {
			return formattingMappings[cell.type](cell.value)
		})
	})
	const maxLns = scanMaximums(formatted)
	formatted.forEach((row) => {
		const rowStr = row.map((cell, ind) => {
			const maxLn = maxLns[ind]
			const padding = maxLn + 2
			const rightPadding = Math.floor(padding / 2)
			const leftPadding = Math.ceil(padding / 2)
			return spaces(leftPadding) + cell + spaces(rightPadding)
		}).join('|')

		console.log(rowStr)
	})
}

const sheets = openFileXlsx(path.join(process.cwd(), process.argv[2]))

display(sheets[0] || [])


