const blessed = require('blessed')
const unicode = require('blessed/lib/unicode')

const REGION_TYPE_DATA = 1
const REGION_TYPE_BORDER = 2

const Cell = function(row, column, type, value) {
	this.row = row
	this.column = column
	this.value = value || ''
}

const CellChar = function(char, width, cell) {
	this.char = char
	this.width = width
	this.cell = cell
	this.type = REGION_TYPE_DATA
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
					const char = part[charIndex]
					
					var str, charWidth
					if(char === undefined) {
						charWidth = 1
						str = ' '
						charIndex++
					} else {
						str = char
						charIndex++
						charWidth = unicode.charWidth(char)
					}

					const x = baseX + iW
					const y = baseY + iH

					if(x === 0) {
						matrix[y] = []
					}

					matrix[y].push(new CellChar(str, charWidth, cell))
					cell.value += str
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
			if(i === 0) return '|' + cell
			if((row[i + 1] && row[i + 1].cell.column !== cell.cell.column)
					|| i === row.length - 1) {
				return cell + '|'
			}
			return cell
		}).join('')
	
	}).join('\n')

	console.log('formatted:\n%s', formatted)
}

const border = (chars) => {
	return {
		value: chars,
		// The type will be important later to determine the colours.
		type: 'border'
	}
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

proto.borderElement = function(rows, dimensions, width, height, rIndex, cIndex) {
	if(rIndex === 0) {
		if(cIndex === 0) {
			return border(BORDER_LEFT_TOP)
		}
		if(cIndex === width - 1) {
			return border(BORDER_RIGHT_TOP)
		}
		if(cIndex % 2 === 0) {
			return border(BORDER_TOP_SPLIT)
		} else {
			return this.horizontalBorder(dimensions, cIndex)
		}
	}

	if(rIndex === height - 1) {
		if(cIndex === 0) {
			return border(BORDER_LEFT_BOTTOM)
		}
		if(cIndex === width -1) {
			return border(BORDER_RIGHT_BOTTOM)
		}
		if(cIndex % 2 === 0) {
			return border(BORDER_BOTTOM_SPLIT)
		} else {
			return this.horizontalBorder(dimensions, cIndex)
		}
	}

	if(cIndex % 2 === 0) {
		if(rIndex % 2 === 0) {
			if(cIndex === 0) {
				return border(BORDER_LEFT_SPLIT)
			}
			if(cIndex === width - 1) {
				return border(BORDER_RIGHT_SPLIT)
			}
		}
		if(rIndex % 2 === 0) {
			return border(BORDER_CROSS)
		}
		return this.verticalBorder(dimensions, rIndex)
	}
	if(rIndex % 2 === 0) {
		return this.horizontalBorder(dimensions, cIndex)
	}
	return border('.')
}

proto.renderBorders = function(rows, dimensions) {
	const height = rows.length * 2 + 1
	const width = rows[0].length * 2 + 1
	const result = new Array(height)
	for(var rIndex = 0; rIndex < height; rIndex++) {
		result[rIndex] = new Array(width)
		for(var cIndex = 0; cIndex < width; cIndex++) {
			if(rIndex % 2 === 0 || cIndex % 2 === 0) {
				result[rIndex][cIndex] = this.borderElement(
					rows, dimensions, width, height, rIndex, cIndex
				)
			} else {
				result[rIndex][cIndex] = {
					value: rows[Math.floor(rIndex / 2)][Math.floor(cIndex / 2)],
					type: 'data'
				}
			}
		}
	}
	return result
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
		return row.map((cell) => cell.value).join('')
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
