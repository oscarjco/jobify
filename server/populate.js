import { readFile } from 'fs/promises'

import dotenv from 'dotenv'
dotenv.config()

import connectDB from './db/connect.js'
import Job from './model/Job.js'

const start = async () => {
    try {
        await connectDB('mongodb+srv://admin:admin@atlascluster.dg6a7wy.mongodb.net/Jobify?retryWrites=true&w=majority')
        await Job.deleteMany()

        const result = JSON.parse(
            await readFile(new URL('./mock-data.json', import.meta.url))
        )

        await Job.create(result)

        console.log('Jobs created')
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

start()