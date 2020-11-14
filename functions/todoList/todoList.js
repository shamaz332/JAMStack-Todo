const { ApolloServer, gql } = require("apollo-server-lambda");
require('dotenv').config()
var faunadb = require("faunadb"),
  q = faunadb.query;


  var adminClient = new faunadb.Client({
    secret: process.env.SECRET,
  });

const typeDefs = gql`
  type Query {
    todos: [Todo!]
  }

  type Mutation {
    addTodo(task: String!): Todo
    delTodo(id: ID!): Todo
  }

  type Todo {
    id: ID!
    task: String!
    status: Boolean!
  }
`;
const resolvers = {
  Query: {
    todos: async (root, args, context) => {
      try {
        const result = await adminClient.query(
          q.Map(
            q.Paginate(q.Match(q.Index("task"))),
            q.Lambda((x) => q.Get(x))
          )
        );

        console.log(result);
        return result.data.map(da => {
          return {
            id: da.ref.id,
            task: da.data.task,
            status: da.data.status
          }
        })
      
      } catch (error) {
        console.log(error);
      }
    },
    // authorByName: (root, args) => {
    //   console.log('hihhihi', args.name)
    //   return authors.find((author) => author.name === args.name) || 'NOTFOUND'
    // },
  },

  Mutation: {
    addTodo: async (_, { task }) => {
      try {
        const result = await adminClient.query(
          q.Create(q.Collection("todo"), {
            data: {
              task: task,
              status: false,
            },
          })
        );


        return result.data;
      } catch (error) {
        console.log(error);
      }
    },

// deleting task 
delTodo: async (_, { id }) => {
  try {

    const result = await adminClient.query(
      q.Delete(q.Ref(q.Collection("todo"), id))

    )
    return result.data;
  } catch (error) {
    console.log(error);
  }
},

  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = server.createHandler();

module.exports = { handler };
