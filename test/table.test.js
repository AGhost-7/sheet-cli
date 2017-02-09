
const table = require('../lib/table')
const State = table.State
const assert = require('assert')

describe('table', () => {

	const expect = [
		['┌', '─', '┬', '─', '┬', '──', '┐'],
		['│', 'a', '│', 'b', '│', 'cc', '│'],
		['└', '─', '┴', '─', '┴', '──', '┘']
	]
	const drawn = expect.map((row) => row.join('')).join('\n')
	it('renders the borders\n' + drawn, () => {
		const st = new State()
		const data = [
			['a', 'b', 'cc']//,
			//['d', 'f', 'gg'],
			//['h', 'i', 'jj']
		]
		//console.log(expect)
		assert.deepEqual(st.withBorders(data), expect)
	})
})
