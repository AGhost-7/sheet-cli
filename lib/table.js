const blessed = require('blessed')
const unicode = require('blessed/lib/unicode')

const REGION_TYPE_DATA = 1
const REGION_TYPE_BORDER = 2

const Cell = function(row, column, value) {
	this.row = row
	this.column = column
	this.value = value || ''
}

Cell.prototype.equal = function(cell) {
	return cell.column === this.column && cell.row === this.row
}

const CellChar = function(char, width, cell) {
	this.char = char
	this.width = width
	this.cell = cell
	this.type = REGION_TYPE_DATA
}

const BorderChar = function(char) {
	this.width = 1
	this.type = REGION_TYPE_BORDER
	this.char = char
}

BorderChar.prototype.toString = function() {
	return this.char
}

CellChar.prototype.toString = function() {
	return this.char
}

const TableRenderer = function() {
	this._preRendered = []
}

const proto = TableRenderer.prototype

const BORDER_LEFT_TOP = '┌'
const BORDER_LEFT_BOTTOM = '└'
const BORDER_RIGHT_TOP = '┐'
const BORDER_RIGHT_BOTTOM = '┘'

const BORDER_VERTICAL = '│'
const BORDER_HORIZONTAL = '─'

const BORDER_LEFT_SPLIT = '├'
const BORDER_TOP_SPLIT = '┬'
const BORDER_BOTTOM_SPLIT = '┴'
const BORDER_RIGHT_SPLIT = '┤'

const BORDER_CROSS = '┼'

proto.stringWidth = function(str) {
	return str.split('\n').reduce((max, part) => {
		let width = 0
		for(var i = 0; i < part.length; i++) {
			width += unicode.charWidth(part[0])
		}
		return Math.max(max, width)
	}, 0)
}

proto.stringHeight = function(str) {
	return str.split('\n').length
}

const max = (a, b) => {
	if(a === undefined) return b
	if(b === undefined) return a
	return Math.max(a, b)
}

proto.cellDimensions = function(rows) {
	const widths = []
	const heights = []
	const self = this

	rows.forEach((row, hInd) => {
		row.forEach((cell, wInd) => {
			const width = self.stringWidth(cell)
			widths[wInd] = max(self.stringWidth(cell), widths[wInd])
			heights[hInd] = max(self.stringHeight(cell), heights[hInd])
		})
	})

	return {
		widths,
		heights
	}
}

proto.padRows = function(rows, dimensions) {
	const self = this
	const widths = dimensions.widths
	const heights = dimensions.heights
	const matrix = []
	let baseX = 0
	let baseY = 0

	for(var iR = 0; iR < heights.length; iR++) {
		var height = heights[iR]
		baseX = 0

		for(var iC = 0; iC < widths.length; iC++) {
			var width = widths[iC]
			const cellText = rows[iR][iC]
			const parts = cellText.split('\n')
			const cell = new Cell(iR, iC)

			for(var iH = 0; iH < height; iH++ ) {
				const part = parts[iH] || ''
				var iW = 0, charIndex = 0

				while(iW < width) {
					var char = part[charIndex]
					
					var charWidth
					if(char === undefined) {
						charWidth = 1
						char = ' '
						charIndex++
					} else {
						charIndex++
						charWidth = unicode.charWidth(char)
					}

					const x = baseX + iW
					const y = baseY + iH

					if(x === 0) {
						matrix[y] = []
					}

					matrix[y].push(new CellChar(char, charWidth, cell))
					cell.value += char
					iW += charWidth
				}
			}
			baseX += width
		}

		baseY += height
	}
	return matrix
}

proto.printPadded = function(padded) {
	const formatted = padded.map((row) => {
		return row.map((cell, i) => {
			if(i === 0
					&& (row[i + 1] && row[i + 1].cell.column !== cell.cell.column)) {
				return '|' + cell + '|'
			}
			if(i === 0) return '|' + cell
			if((row[i + 1] && row[i + 1].cell.column !== cell.cell.column)
					|| i === row.length - 1) {
				return cell + '|'
			}
			return cell
		}).join('')
	
	}).join('\n')

	console.log('padded:\n%s', formatted)
}

const border = (char) => {
	return new BorderChar(char)
}

proto.horizontalBorder = function(dimensions, cIndex) {
	let width = dimensions.widths[Math.floor(cIndex / 2)]
	let str = ''
	while(width--) str += BORDER_HORIZONTAL
	return border(str)
}

proto.verticalBorder = function(dimensions, rIndex) {
	let height = dimensions.heights[Math.floor(rIndex / 2)]
	let str = ''
	while(height--) str += BORDER_VERTICAL
	return border(str)
}

proto.createMatrix = function(height, width, fill) {
	if(arguments.length === 2) fill = null
	const matrix = new Array(height)
	for(var iY = 0; iY < height; iY++) {
		matrix[iY] = new Array(width)
		for(var iX = 0; iX < width; iX++) {
			matrix[iY][iX] = fill
		}
	}
	return matrix
}

proto.renderBorders = function(paddedMatrix, dimensions) {
	const height = dimensions.heights.length + 1 + paddedMatrix.length
	const width = dimensions.widths.length + 1 + paddedMatrix[0].length
	const matrix = this.createMatrix(height, width)

	matrix[0][0] = border(BORDER_LEFT_TOP)
	matrix[0][width - 1] = border(BORDER_RIGHT_TOP)
	matrix[height - 1][0] = border(BORDER_LEFT_BOTTOM)
	matrix[height - 1][width - 1] = border(BORDER_RIGHT_BOTTOM)

	for(var y = 0; y < paddedMatrix.length; y++) {
		const row = paddedMatrix[y]
		for(var x = 0; x < row.length; x++) {
			const cellChar = row[x]
			const rIndex = cellChar.cell.row
			const cIndex = cellChar.cell.column
			const cellX = cIndex + x + 1
			const cellY = rIndex + y + 1
			const cellCharRight = row[x + 1]
			const cellCharBellow = paddedMatrix[y + 1] && paddedMatrix[y + 1][x]

			if(cellX === 1) {
				matrix[cellY][0] = border(BORDER_VERTICAL)
			}

			if(cellX === 1
					&& cellCharBellow
					&& cellCharBellow.cell.row !== cellChar.cell.row) {
				matrix[cellY + 1][0] = border(BORDER_LEFT_SPLIT)
			}

			if(cellY === 1
					&& cellCharRight
					&& cellCharRight.cell.column !== cellChar.cell.column) {
				matrix[0][cellX + 1] = border(BORDER_TOP_SPLIT)
			}

			if(cellY === height - 2
					&& cellCharRight
					&& cellCharRight.cell.column !== cellChar.cell.column) {
				matrix[height - 1][cellX + 1] = border(BORDER_BOTTOM_SPLIT)
			}

			if(cellX === width - 2
				 	&& cellCharBellow
					&& cellCharBellow.cell.row !== cellChar.cell.row) {
				matrix[cellY + 1][width - 1] = border(BORDER_RIGHT_SPLIT)
			}

			if(cellCharBellow
					&& cellCharRight
					&& cellCharBellow.cell.row !== cellChar.cell.row
					&& cellCharRight.cell.column !== cellChar.cell.column) {
				matrix[cellY + 1][cellX + 1] = border(BORDER_CROSS)
			}

			if(!cellCharRight
					|| cellCharRight.cell.column !== cellChar.cell.column) {
				matrix[cellY][cellX + 1] = border(BORDER_VERTICAL)
			}

			if(cellY === 1) {
				matrix[0][cellX] = border(BORDER_HORIZONTAL)
			}

			if(!cellCharBellow
					|| cellCharBellow.cell.row !== cellChar.cell.row) {
				matrix[cellY + 1][cellX] = border(BORDER_HORIZONTAL)
			}

			matrix[cellY][cellX] = cellChar
		}
	}

	return matrix
}



proto.setRows = function(rows) {
	this.preRender(rows)
	return this.render(rows)
}

proto.preRender = function(rows) {
	const dimensions = this.cellDimensions(rows)
	const padded = this.padRows(rows, dimensions)
	this._preRendered = this.renderBorders(rows, dimensions)
}

proto.render = function() {
	return this._preRendered.map((row) => {
		return row.map((cell) => cell.toString()).join('')
	}).join('\n')
}

const createTable = (options) => {
	const table = blessed.box({
		parent: options.parent
	})

	const renderer = new TableRenderer()

	const screen = options.parent.screen

	table.on('resize', () => {
		screen.log('resized')
	})

	table.setRows = (data) => {
		const rendered = renderer.setRows(data)
		table.setContent(rendered)
	}

	if(options.rows) {
		table.setRows(options.rows)
	}

	return table
}

module.exports = createTable
module.exports.TableRenderer = TableRenderer
