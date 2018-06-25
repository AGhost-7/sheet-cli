const openFile = require('../lib/open-file')
const path = require('path')
const assert = require('assert')

const openFixture = relPath => {
  return openFile(path.join(__dirname, relPath))[0]
}

describe('open-file', () => {
  it('csv parsing', () => {
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
    ]
    const sheet = openFixture('./fixtures/simple.csv')

    assert.deepEqual(sheet.rows, expected)
  })

  it('xlsx parsing', () => {
    const expected = [
      [
        { type: 'string', value: 'a' },
        { type: 'date', value: '2017/01/20' },
        { type: 'string', value: 'c' }
      ],
      [
        { type: 'boolean', value: true },
        { type: 'number', value: 2 },
        { type: 'number', value: 3.99 }
      ]
    ]

    const sheet = openFixture('./fixtures/simple.xlsx')
    assert.deepEqual(sheet.rows, expected)
  })

  it('should normalize columns', () => {
    const data = [
      [{ type: 'string', value: '1' }, { type: 'string', value: '2' }],
      [{ type: 'string', value: '3' }]
    ]
    const normalized = openFile.normalizeColumns(data)
    assert.equal(normalized[1].length, 2)
  })
})
