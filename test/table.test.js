
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

		assert.deepEqual(renderer.padRows(data1), expect)
	})

	it.skip('renders the borders', () => {
		const expect = [
			['┌', '─', '┬', '─', '┬', '──', '┐'],
			['│', 'a', '│', 'b', '│', 'cc', '│'],
			['└', '─', '┴', '─', '┴', '──', '┘']
		]
		//const drawn = expect.map((row) => row.join('')).join('\n')
		const data = [
			['a', 'b', 'cc']//,
			//['d', 'f', 'gg'],
			//['h', 'i', 'jj']
		]
		//console.log(expect)
		assert.deepEqual(renderer.withBorders(data), expect)
	})
})
