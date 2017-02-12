
const table = require('../lib/table')
const TableRenderer = table.TableRenderer
const assert = require('assert')

describe('table', () => {

	const data1 = [
		['a a', 'bbbb', 'c', ''],
		['d', 'd', 'ee', 'Ｆ']
	]
	const renderer = new TableRenderer()

	it('calculates the column widths', () => {
		assert.deepEqual(renderer.columnWidths(data1), [3, 4, 2, 2])
	})

	it('pads the data', () => {
		const expect = [
			['a a', 'bbbb', 'c ', '  '],
			['d  ', 'd   ', 'ee', 'Ｆ']
		]

		const dimensions = renderer.cellDimensions(data1)
		const padded = renderer.padRows(data1, dimensions)
		assert.deepEqual(padded, expect)
	})

	it('renders the borders', () => {
		const expect = [
			[ '┌', '─', '┬', '─', '┬', '──', '┐' ],
			[ '│', 'a', '│', 'b', '│', 'cc', '│' ],
			[ '├', '─', '┼', '─', '┼', '──', '┤' ],
			[ '│', 'd', '│', 'f', '│', 'gg', '│' ],
			[ '├', '─', '┼', '─', '┼', '──', '┤' ],
			[ '│', 'h', '│', 'i', '│', 'jj', '│' ],
			[ '└', '─', '┴', '─', '┴', '──', '┘' ]
		]
		const data = [
			['a', 'b', 'cc'],
			['d', 'f', 'gg'],
			['h', 'i', 'jj']
		]
		const dimensions = renderer.cellDimensions(data)
		const rendered = renderer.renderBorders(data, dimensions)
		const result = rendered.map((row) => {
			return row.map((row) => row.value)
		})
		assert.equal(result.length, expect.length)
		assert.equal(result[0].length, expect[0].length)
		assert.deepEqual(result, expect)
	})
})
