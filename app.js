const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;

const schema = require('./schema/schema')
const mongoose = require('mongoose')
const app = express()


mongoose.connect('mongodb+srv://gpl-test:420059@cluster0.0fywb.mongodb.net/Cluster0?retryWrites=true&w=majority')
mongoose.connection.once('open', () => {
    console.log('conneted to db')
})
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.listen(4000, () => {
    console.log('now listen for port 4000')
})