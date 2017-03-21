
const table = require('../lib/table')
const TableRenderer = table.TableRenderer
const assert = require('power-assert')

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
			['a', ' ', 'a', 'b', 'b', 'b', 'b', 'c', ' ', ' ', ' '],
			['d', ' ', ' ', 'd', ' ', ' ', ' ', 'e', 'e', 'Ｆ']
		]

		const dimensions = renderer.cellDimensions(data1)
		const padded = renderer.padRows(data1, dimensions)
		const chars = padded.map((row) => {
			return row.map((cell) => cell.toString())
		})
		renderer.printPadded(padded)
		assert.deepEqual(chars, expect)
	})

	it('pads with line breaks', () => {
		const data = [
			['a\na', 'b'],
			['cc', 'd']
		]
		
		const dimensions = renderer.cellDimensions(data)
		const padded = renderer.padRows(data, dimensions)
		renderer.printPadded(padded)
		assert.equal(padded[0][0].cell.column, padded[1][0].cell.column)
		assert.equal(padded[0][0].cell.column, 0)

		const expect = [
			['a', ' ', 'b'],
			['a', ' ', ' '],
			['c', 'c', 'd']
		]

		const chars = padded.map((row) => {
			return row.map((cell) => cell.toString())
		})

		assert.deepEqual(chars, expect)
	})

	it('renders the borders', () => {
		const expect = [
			[ '┌', '─', '┬', '─', '─', '┬', '─', '─', '┐' ],
			[ '│', 'a', '│', 'b', ' ', '│', 'c', 'c', '│' ],
			[ '├', '─', '┼', '─', '─', '┼', '─', '─', '┤' ],
			[ '│', 'd', '│', 'f', 'f', '│', 'g', ' ', '│' ],
			[ '├', '─', '┼', '─', '─', '┼', '─', '─', '┤' ],
			[ '│', 'h', '│', 'i', ' ', '│', 'j', ' ', '│' ],
			[ '│', ' ', '│', ' ', ' ', '│', 'j', ' ', '│' ],
			[ '└', '─', '┴', '─', '─', '┴', '─', '─', '┘' ]
		]
		const data = [
			['a', 'b', 'cc'],
			['d', 'ff', 'g'],
			['h', 'i', 'j\nj']
		]
		const dimensions = renderer.cellDimensions(data)
		const padded = renderer.padRows(data, dimensions)
		const rendered = renderer.renderBorders(padded, dimensions)
		const result = rendered.map((row) => {
			return row.map((cell) => cell.toString())
		})
		console.log(result.map((row) => row.join('')).join('\n'))
		assert.deepEqual(result, expect)
	})
})
