
const table = require('../lib/table')
const TableRenderer = table.TableRenderer
const assert = require('assert')

describe('table', () => {

	const data1 = [
		['a a', 'bbbb', 'c', ''],
		['d', 'd', 'ee', 'Ｆ']
	]
	const renderer = new TableRenderer()

	it('calculates string widths', () => {
		assert.equal(renderer.stringWidth('a\nb'), 1)
		assert.equal(renderer.stringWidth('a '), 2)
	})

	it('calculates string heights', () => {
		assert.equal(renderer.stringHeight('a\nb'), 2)
		assert.equal(renderer.stringHeight('a\\nb'), 1)
	})

	it('calculates the cell dimensions', () => {
		const dimensions = renderer.cellDimensions(data1)
		assert.deepEqual(dimensions.widths, [3, 4, 2, 2])
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

	it('pads with line breaks', () => {
		const data = [
			['a\na', 'b'],
			['cc', 'd']
		]
		const expect = [
			['a \na ', 'b\n '],
			['cc', 'd']
		]
		const dimensions = renderer.cellDimensions(data)
		const padded = renderer.padRows(data, dimensions)
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
		console.log(result)
		assert.equal(result.length, expect.length)
		assert.equal(result[0].length, expect[0].length)
		assert.deepEqual(result, expect)
	})
})
