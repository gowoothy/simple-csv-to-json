export interface ICsvToJsonResult {
	csv: object[]
}

const REGEX_COMMAS_OUTSIDE_QUOTES: RegExp = /(".*?"|[^",]+)(?=\s*,|\s*$)/g
const REGEX_DOUBLE_COMMAS_OUTSIDE_QUOTES: RegExp = /,{2}(?=(?:[^"]*"[^"]*")*[^"]*$)/g
const CSV_LINE_SEPARATOR: string = String.fromCharCode(0x1)

export const splitStringByCSVCommas = (
	str: string,
	replaceEmptyColumnWithIndex: boolean = false,
) => {
	if (str.charAt(0) === ',') {
		str = CSV_LINE_SEPARATOR + str
	}
	if (str.charAt(str.length - 1) === ',') {
		str = str + CSV_LINE_SEPARATOR
	}

	str = str.replace(
		REGEX_DOUBLE_COMMAS_OUTSIDE_QUOTES,
		',' + CSV_LINE_SEPARATOR + ',',
	)

	const results: string[] | null = str.match(REGEX_COMMAS_OUTSIDE_QUOTES)
	if (!results) {
		return []
	}
	return (
		results.map((column: string, index: number) =>
			column === CSV_LINE_SEPARATOR
				? replaceEmptyColumnWithIndex
					? index.toString()
					: null
				: isNaN(Number(column))
				? column
				: Number(column),
		) || []
	)
}

export const mergeKVArrays = (keys: any[], values: any[]): object =>
	keys.reduce(
		(obj: object, key: string, index: number) => ({
			...obj,
			[key]: values[index],
		}),
		{},
	)

export const csvToJson = (csv: string) => {
	let csvData: string[] | object[] = csv
		.split('\n')
		.filter((line: string) => line) // remove empty lines

	const csvHeaderRow: string | undefined = csvData.shift()
	const result: ICsvToJsonResult = { csv: [] }
	if (csvHeaderRow) {
		const headers: Array<string | number | null> = splitStringByCSVCommas(
			csvHeaderRow,
			true,
		)
		csvData = csvData.map((row: string) =>
			mergeKVArrays(headers, splitStringByCSVCommas(row)),
		)
		result.csv = csvData
	}

	return result
}

interface IJsonDocument {
	[key: string]: string | number | boolean | Date
}

export const jsonToCsv = (json: IJsonDocument[]) => {
	let result: string = ''

	let headers = json.reduce((acc: string[], item: any) => {
		acc.push(...Object.keys(item))
		return acc
	}, [])
	headers = headers.filter((h: string, i: number) => headers.indexOf(h) === i)
	result = headers.map((h: string) => `"${h}"`).join() + '\n'
	json.forEach(doc => {
		const row: string[] = Array.from({ length: headers.length }, () => '')
		Object.keys(doc).forEach(
			(key: string) =>
				(row[headers.indexOf(key)] = `"${doc[key].toString()}"`),
		)
		result += row.join() + '\n'
	})

	return result
}

module.exports = {
	csvToJson,
	jsonToCsv,
}
