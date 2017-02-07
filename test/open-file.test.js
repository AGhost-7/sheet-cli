const openFile = require('../lib/open-file')
const path = require('path')
const assert = require('assert')

const createScenario = (relPath) => {
	const workbook = openFile(path.join(__dirname, relPath))

	const sheet = workbook[0]
	
	const expected = [
		[
			{ type: 'string', value: 'a' },
			{ type: 'string', value: 'b' },
			{ type: 'string', value: 'c' }
		],
		[
			{ type: 'number', value: 1 },
			{ type: 'number', value: 2 },
			{ type: 'number', value: 3 }
		]
	];

	assert.deepEqual(sheet.rows, expected)

}

describe('open-file', () => {

	it('csv parsing', () => {
		createScenario('fixtures/simple.csv')
	})

	it('xlsx parsing', () => {
		createScenario('fixtures/simple.xlsx')
	})
})
