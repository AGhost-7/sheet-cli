'use strict'

const TableRenderer = require('../lib/table').TableRenderer
const openFile = require('../lib/open-file')
const file = openFile('./test/fixtures/large.csv')
const renderer = new TableRenderer()
const rows = file[0].rows.map((row) => {
	return row.map((cell) => {
		return cell.value.toString()
	})
})
renderer.setRows(rows)

const before = Date.now()

for(let i = 0; i < 30000; i++) {
	renderer.render()
}
const after = Date.now()
console.log('Before:', before)
console.log('After:', after)
console.log('Difference:', after - before)

