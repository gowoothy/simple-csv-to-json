import assert from 'assert'

import * as testSuite from '../csvToJson'
import * as testData from './test-data/csv'

describe('csvToJson test suite', () => {
    it('should merge two arrays into an object with key -> value associations', () => {
        const testValues = {
            keyArray: ['first', 'last', 'phone', 'email', 'age'],
            valueArray: ['john', 'doe', '555-555-5678', 'jon@doe.com', null],
        }
        const actual = testSuite.mergeKVArrays(testValues.keyArray, testValues.valueArray)
        const expected = {
            age: null,
            email: 'jon@doe.com',
            first: 'john',
            last: 'doe',
            phone: '555-555-5678',
        }
        assert.deepEqual(actual, expected)
    })
    it('should return an array of values that are comma delimited outside of quotes', () => {
        const testValues: Array<{expected: Array<string|number|null>, param: string, message: string}> = [
            {
                expected: [
                    'john',
                    'doe',
                    '555-555-5678',
                    'jon@doe.com',
                    42,
                ],
                message: 'Test with nothing out of the ordinary',
                param: 'john,doe,555-555-5678,jon@doe.com,42',
            },
            {
                expected: [
                    'jane',
                    'doe',
                    '555-555-5679',
                    'jane@doe.com',
                    '"Indeed, this is a comment!"',
                    42,
                ],
                message: 'Test with commas within quotes and contains numbers',
                param: 'jane,doe,555-555-5679,jane@doe.com,"Indeed, this is a comment!",42',
            },
            {
                expected: [
                    null,
                    'jones',
                    '555-555-5555',
                    'jenna@beauty.com',
                    '"I am a beautiful person."',
                    null,
                ],
                message: 'Test with empty columns.',
                param: ',jones,555-555-5555,jenna@beauty.com,"I am a beautiful person.",',
            },
        ]
        testValues.forEach(({expected, param, message}:
            {expected: Array<string|number|null>, param: string, message: string }) => {
            const actual: Array<string|number|null> = testSuite.splitStringByCSVCommas(param)
            assert.deepEqual(actual, expected, message)
        })
    })

    it('should convert a CSV to JSON', () => {
        const actual: testSuite.ICsvToJsonResult = testSuite.csvToJson(testData.csvData)
        const expected: testSuite.ICsvToJsonResult = {
            csv: [
                {
                    age: '42',
                    comment: 'This is a comment!',
                    email: 'jon@doe.com',
                    first: 'john',
                    last: 'doe',
                    phone: '555-555-5678',
                },
                {
                    age: '42',
                    comment: '"Indeed, this is a comment!"',
                    email: 'jane@doe.com',
                    first: 'jane',
                    last: 'doe',
                    phone: '555-555-5679',
                },
                {
                    age: null,
                    comment: '"I am a beautiful person."',
                    email: 'jenna@beauty.com',
                    first: 'jenna',
                    last: null,
                    phone: '555-555-5555',
                },
            ],
        }
        assert.deepEqual(actual, expected)
    })
})

// first,last,phone,email,comment,age
// john,doe,555-555-5678,jon@doe.com,This is a comment!,42
// jane,doe,555-555-5679,jane@doe.com,"Indeed, this is a comment!",42
// jenna,,555-555-5555,jenna@beauty.com,"I am a beautiful person.",
