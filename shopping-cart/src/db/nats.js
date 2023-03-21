const natsWrapper= require('../nats-wrapper')
    try {
     natsWrapper.connect('shopping','asjh','http://nats-srv:4222')    
     natsWrapper._client.on('close',()=>{
         console.log('NATS connection Closed!!!');
         process.exit();
     });
     process.on('SIGINT',()=>natsWrapper._client.close())  
     process.on('SIGTERM',()=>natsWrapper._client.close()) 
    } catch (err) {
    console.error(`Error connecting to NATS: ${err}`);  
    }