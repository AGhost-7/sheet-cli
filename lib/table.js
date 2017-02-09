const blessed = require('blessed')

const State = function() {
	this._preRendered = []
}

const proto = State.prototype

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

// start off by mapping the rows to a grid.
proto.withBorders = function(rows) {
	
}

proto.setRows = function(table, rows) {

}

const createTable = (options) => {

	const table = blessed.box({
		parent: options.parent
	})

	const screen = options.parent.screen

	table.on('resize', () => {
		screen.log('resized')
	})
		
	table.setContent('foobar')
	return table
}

module.exports = createTable
module.exports.State = State
