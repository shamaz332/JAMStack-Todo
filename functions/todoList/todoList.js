const { ApolloServer, gql } = require("apollo-server-lambda");
var faunadb = require("faunadb"),
  q = faunadb.query;
const typeDefs = gql`
  type Query {
    todos: [Todo!]
  }

  type Mutation {
    addTodo(task: String!): Todo
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
        var adminClient = new faunadb.Client({
          secret: "fnAD6jOBMOACBYsnWofZoXmjA9hpeCGckVF9JZwU",
        });
        const result = await adminClient.query(
          q.Map(
            q.Paginate(q.Match(q.Index("task"))),
            q.Lambda((x) => q.Get(x))
          )
        );

        console.log(result);
        return result.data.map(da => {
          return {
            id: da.ts,
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
        var adminClient = new faunadb.Client({
          secret: "fnAD6jOBMOACBYsnWofZoXmjA9hpeCGckVF9JZwU",
        });
        const result = await adminClient.query(
          q.Create(q.Collection("todo"), {
            data: {
              task: task,
              status: false,
            },
          })
        );


        return result.ref.data;
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
