// BISMILLAHIR RAHMANINR RAHIM
const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId 


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


        // get api to load all contacts 

        app.get('/contacts', async(req, res)=>{
            const cursor = contactsCollection.find({}) // initially set empty object 
            const page = req.query.page // fetch the page info 
            const size = parseInt(req.query.size)  // get the page size 
            let contacts; 
            const count = await cursor.count()
            if(page){
                contacts= await cursor.skip(page*size).limit(size).toArray()
            }else{
                contacts = await cursor.toArray() 
            }
           
           
            
            res.send({
                count,
                contacts
            })
        })

        // delete api to delete specific contact 
        app.delete('/contacts/:id', async(req, res)=>{
            const id = req.params.id  
            const query = {_id:ObjectId(id)}
            const result = await contactsCollection.deleteOne(query)
            res.json(result)

        })
        // get api to display specific contact information 
        app.get('/contacts/:id', async(req, res)=>{
            const id = req.params.id 
            const query = {_id:ObjectId(id)} 
            const contact = await contactsCollection.findOne(query)
            res.send(contact) 
        })

        // put api to upate contact  
        app.put('/contacts/:id', async(req, res)=>{
            const id = req.params.id; 
            const updatedContact = req.body 
            const filter = {_id: ObjectId(id)}
            const updateDoc = {
                $set:{
                    firstName: updatedContact.firstName,
                    lastName: updatedContact.lastName,
                    companyName: updatedContact.companyName,
                    email:updatedContact.email, 
                    telePhoneNumber:updatedContact.telePhoneNumber,
                    mobilePhoneNumber: updatedContact.mobilePhoneNumber,
                    country:updatedContact.country,
                    city:updatedContact.city,
                    state:updatedContact.state,
                    photoURL:updatedContact.photoURL




                },
            }
            const result = await contactsCollection.updateOne(filter, updateDoc) 

            
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