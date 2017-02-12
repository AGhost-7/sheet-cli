const blessed = require('blessed')
const charWidth = require('blessed/lib/unicode').charWidth

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
	let width = 0
	for(var i = 0; i < str.length; i++) {
		width += charWidth(str[i])
	}
	return width
}

proto.columnWidths = function(rows) {
	const self = this
	let widths = []
	rows.forEach((row) => {
		row.forEach((cell, i) => {
			const width = self.stringWidth(cell)
			widths[i] = widths[i] === undefined ? width : Math.max(width, widths[i])
		})
	})
	return widths
}

proto.stringHeight = function(cell) {
	// TODO
	return 1
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

proto.spaces = function(ln) {
	let str = ''
	while(--ln > -1) str += ' '
	return str
}

proto.padRows = function(rows, dimensions) {
	// TODO: Pad for the height
	const self = this
	const widths = dimensions.widths
	return rows.map((row) => {
		return row.map((cell, i) => {
			const ln = self.stringWidth(cell)
			const padding = self.spaces(widths[i] - ln)
			return cell + padding
		})
	})
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
	// TODO
	return border(BORDER_VERTICAL)
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

}

proto.preRender = function(rows) {

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
		
	table.setContent('foobar')
	return table
}

module.exports = createTable
module.exports.TableRenderer = TableRenderer
