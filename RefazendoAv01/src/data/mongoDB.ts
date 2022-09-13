import { Db, MongoClient } from "mongodb"

class Mongodb{
    private client: MongoClient
    private db: Db

    constructor(){
        const url = 'mongodb://localhost:27017'
        this.client = new MongoClient(url)
        this.db = this.client.db('revisando')
    }

    public getInstance(){
        return this.db
    }
}

export const db = new Mongodb().getInstance()