
class Publisher{
    constructor(client){
        this.client = client
    }
    publishEvent(subject,data){
        return new Promise((resolve, reject) => {
            this.client.publish(subject,JSON.stringify(data),(err,guid)=>{
                if(err){
                   return reject(err)
                }
                console.log('published message guid: ' + guid)
                resolve()
            })

          });   
    }

}
module.exports = Publisher;