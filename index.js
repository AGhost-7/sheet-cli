#!/usr/bin/env node

const path = require('path')
const openFile = require('./lib/open-file')

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
		return accu
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

