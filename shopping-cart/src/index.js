const express = require('express')
require('./db/nats')
require('./db/mongoose')

const cartRouter = require('./routers/cartRouter')

const app = express();

const port = process.env.PORT

app.use(express.json())
app.use(cartRouter)

app.listen(port,()=>{
    console.log(`server is on port ${port}`)
})