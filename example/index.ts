import { db } from '../sqlTemplateTag'
import { Client } from 'pg'



async function run(){
	const client = new Client()

	const a = await db(client)`SELECT NOW()`
	const b = await db`SELECT NOW()`
}

run()