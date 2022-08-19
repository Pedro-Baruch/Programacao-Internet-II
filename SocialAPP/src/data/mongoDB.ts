import { Db, MongoClient } from "mongodb";

class MongoDatabase{
    
    private client: MongoClient
    private db: Db

    constructor(){
        const uri = 'mongodb://localhost:27017'
        this.client = new MongoClient(uri)
        this.db = this.client.db('socialapp')
    }

    public getInstance(){
        return this.db
    }
}

const db = new MongoDatabase().getInstance()

export { db }