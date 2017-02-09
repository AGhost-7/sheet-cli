const blessed = require('blessed')
const Table = require('../lib/table')

const screen = blessed.screen({
	autoPadding: false,
	smartCSR: true,
	log: process.cwd() + '/sheet.log'
})

const table = Table({
	parent: screen
})

screen.key('q', () => {
	process.exit(0)
})

screen.render()
