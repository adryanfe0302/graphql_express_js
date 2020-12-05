const graphql = require('graphql')
const _ = require('lodash')
const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLInt
} = graphql;

// dummy data
var books = [
    {name: 'sailor', genre: 'horror', id:'2', authorId:'2'},
    {name: 'godfather', genre: 'scifi', id:'1', authorId:'1'},
    {name: 'madman', genre: 'fantasy', id:'3', authorId:'3'}
]

var authors = [
    {name: 'frank', age: 34, id:'2'},
    {name: 'lamda', age: 25, id:'1'},
    {name: 'finonas', age: 28, id:'3'}
]

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {type: GraphQLID },
        name: {type: GraphQLString },
        genre: {type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                console.log(parent)
                return _.find(authors, {id: parent.authorId})
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {type: GraphQLID },
        name: {type: GraphQLString },
        age: {type: GraphQLInt }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                //get data from db
               console.log(typeof(args.id))
               return _.find(books, {id: args.id})
            }  
        },
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                //get data from db
                console.log(typeof(args.id))
               return _.find(authors, {id: args.id})
            }  
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})