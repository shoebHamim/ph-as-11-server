const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express =require('express')
const cors =require('cors')
require('dotenv').config()
const app=express()
const port= process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mozdknj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    const servicesCollection=client.db('shootpro').collection('services')
    app.get('/services/:home',async(req,res)=>{
      const query={}
      const cursor = servicesCollection.find(query)
      const services= await cursor.toArray()
      if(req.params.home==='home'){
        const sliced=services.slice(0,3)
        res.send({sliced}.sliced)
      }
      else{
        res.send({services}.services)
      }
    }) 
  app.get('/serviceDetails/:id',async(req,res)=>{
    const _id=req.params.id
    const query={_id:ObjectId(_id)}
    const service=await servicesCollection.findOne(query)
    res.send(service)
  })
  //reviews section
  const reviewCollection=client.db('shootpro').collection('reviews')
  // taking service id and returning all reviews under that service id
  app.get('/reviews/:id',async(req,res)=>{
    const serviceId=req.params.id
    const query={service_id:serviceId}
    const cursor=reviewCollection.find(query)
    const reviews=await cursor.toArray()
    res.send(reviews)
  })
  // adding user reviews
  app.post('/addreview',async(req,res)=>{
    const review=req.body
    const result=await reviewCollection.insertOne(review)
    res.send(result)
  })

  // delivering user specific reviews
  app.get('/myreviews/:id',async(req,res)=>{
    const id=req.params.id
    const query={reviewer_id:id}
    const cursor= reviewCollection.find(query)
    const user_specific_reviews=await cursor.toArray()
    res.send(user_specific_reviews)

  })
//deleting review
app.delete('/myreviews/:id',async(req,res)=>{
  const id=req.params.id
  const query={_id:ObjectId(id)}
  const result=await reviewCollection.deleteOne(query)
  res.send(result)
})
//adding service
app.post('/addservice',async(req,res)=>{
  const service=req.body
  const result=await servicesCollection.insertOne(service)
  res.send(result)
})

  }
  finally{

  }

}
run().catch(err=>console.log(err))



app.get('/',(req,res)=>{
  res.send('shootpro server is running')
})

app.listen(port,()=>{
  console.log('shootpro server is running on port',port);
})
