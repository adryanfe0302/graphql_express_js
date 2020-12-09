const graphql = require('graphql')
const _ = require('lodash')

const Book = require('../models/book')
const Author = require('../models/author')

const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;


// dummy data
// var books = [
//     {name: 'sailor', genre: 'horror', id:'2', authorId:'2'},
//     {name: 'godfather', genre: 'scifi', id:'1', authorId:'1'},
//     {name: 'madman', genre: 'fantasy', id:'3', authorId:'3'},
//     {name: 'little', genre: 'horror', id:'4', authorId:'2'},
//     {name: 'corious', genre: 'fantasy', id:'5', authorId:'2'},
//     {name: 'vue', genre: 'fantasy', id:'6', authorId:'1'}
// ]

// var authors = [
//     {name: 'frank', age: 34, id:'2'},
//     {name: 'lamda', age: 25, id:'1'},
//     {name: 'finonas', age: 28, id:'3'}
// ]

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
                // return _.find(authors, {id: parent.authorId})
                return Author.findById(parent.authorId)
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {type: GraphQLID },
        name: {type: GraphQLString },
        age: {type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, arg){
                // return _.filter(books,{authorId: parent.id})
                return Book.find({authorId: parent.id})
            }
        }
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
            //    return _.find(books, {id: args.id})
                return Book.findById(args.id)
            }  
        },
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                //get data from db
               console.log(typeof(args.id))
            //    return _.find(authors, {id: args.id})
                return Author.findById(args.id) 
            }  
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                // return books
                return Book.find({})
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                // return Author
                return Author.find({})
            }
        }
    }
})

const Mutations = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args){
                let author = new Author({
                    name: args.name,
                    age: args.age
                })
                return author.save()
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                genre: {type: new GraphQLNonNull(GraphQLString)},
                authorId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                })
                return book.save()
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutations
})