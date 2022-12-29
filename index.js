const express = require('express');
const cors = require('cors');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sb5ycdx.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        const postsCollection = client.db('social-media').collection('posts')


        app.post('/addPost', async(req, res) =>{
            const user = req.body 
            
            const result = await postsCollection.insertOne(user);
            res.send(result)
        })

        app.get('/viewPost', async(req, res)=>{
            const query = {}
            const post = await postsCollection.find(query).toArray()
            res.send(post)
        })

        app.get('/3posts', async (req, res) => {
            const query = {}
            const cursor = postsCollection.find(query)
            const Posts = await cursor.skip(0).limit(3).toArray()
            res.send(Posts)
        })
        
        app.get('/details/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const postDetails = await postsCollection.findOne(query)
            res.send(postDetails)
        })

    }
    finally{

    }
}
run().catch(console.log)

app.get('/', (req, res) =>{
    res.send('server is running')
})

app.listen(port, () =>{
    console.log(`social media server is running ${port}`);
})