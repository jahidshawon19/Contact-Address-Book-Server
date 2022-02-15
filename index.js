// BISMILLAHIR RAHMANINR RAHIM
const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')


const app = express() 
const port = process.env.PORT || 5000; 


//middlewere 
app.use(cors())
app.use(express.json())


// check server is running or not 
app.get('/', (req, res) =>{
    res.send('<h1>Running Contact Addresss Book Server</h1>')
})
app.listen(port, ()=>{
    console.log(`Running server on port: ${port}`)
})




// database connection start 


const uri = "mongodb+srv://contactBookAdmin:7KKuH86xuQlBaebT@cluster0.1yfcy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {

        await client.connect()
        const database = client.db("contactAddress")
        const contactsCollection = database.collection("contacts")

        // post api to create new contact 

        app.post('/contacts', async(req, res)=>{
        
            const newContact = req.body 
            const result = await contactsCollection. insertOne(newContact)
            res.json(result)
            
        })

        console.log('Database Connected Successfully')

    } finally {
        // await client.close()
    }
}

run().catch(console.dir())

// database connection end 



//contactBookAdmin
//7KKuH86xuQlBaebT