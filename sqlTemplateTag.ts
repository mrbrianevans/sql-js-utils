import { Client } from 'pg'

const _query: (client: Client, text: ReadonlyArray<string>, values: any[])=>Promise<any[]>  = async (client, text, values) => {
	const queryText = text.reduce((query, phrase, index)=>`${query} ${phrase}$${index+1}`, '')
	const { rows } = await client.query(queryText, values)
	return rows
}
async function dbWithClient(stringArray: ReadonlyArray<string>, args: any[]){
	const client = new Client()
	const result = await _query(client, stringArray, args)
	await client.end()
	
	return result
}

// can call db with an existing client, or call it with a string to create one for a single query
export function db(arg1: Client): (stringArray: ReadonlyArray<string>, ...args: any[]) => Promise<any[]>;
export function db(arg1: ReadonlyArray<string>, ...args: any[]): Promise<any[]>
export function db(arg1: ReadonlyArray<string>|Client, ...args: any[]): Promise<any[]>|((stringArray: ReadonlyArray<string>, ...args: any[]) => Promise<any[]>){
	console.log('Passed existing client? ', arg1 instanceof Client)
	if(arg1 instanceof Client){
		const client = arg1
		return (stringArray: ReadonlyArray<string>, ...args: any[]) => _query(client, stringArray, args)
	}
	const stringArray = arg1
	return dbWithClient(stringArray, args)
}

export const dbs: (arg1: ReadonlyArray<string>|Client, ...args: any[]) => Promise<any[]>|((stringArray: ReadonlyArray<string>, ...args: any[]) => Promise<any[]>) = 
  (arg1, ...args) => {
	console.log('Passed existing client? ', arg1 instanceof Client)
	if(arg1 instanceof Client){
		const client = arg1
		return (stringArray: ReadonlyArray<string>, ...args: any[]) => _query(client, stringArray, args)
	}
	const stringArray = arg1
	return dbWithClient(stringArray, args)
}

// using a re-usable database pool
//const pool = new Pool()
//const client = pool.client()
//const people = await queryc(client)`SELECT * FROM people WHERE dob > ${new Date()}`
//await client.end()
//await pool.end()

// a single query with zero setup/teardown
//const cars = await db`SELECT * FROM cars WHERE price > ${50}`