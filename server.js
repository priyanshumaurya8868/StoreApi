const http = require("http")
const port = 300
const app = require('./app')

const server = http.createServer(app)

server.listen(port,()=>{
    console.log(`listening portNo. ${port} `)
})