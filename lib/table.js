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

proto.spaces = function(ln) {
	let str = ''
	while(--ln > -1) str += ' '
	return str
}

proto.padRows = function(rows) {
	const self = this
	const widths = self.columnWidths(rows)
	return rows.map((row) => {
		return row.map((cell, i) => {
			const ln = self.stringWidth(cell)
			const padding = self.spaces(widths[i] - ln)
			return cell + padding
		})
	})
}

proto.renderBorders = function(rows) {
	
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
