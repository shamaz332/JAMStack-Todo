const { ApolloServer, gql } = require("apollo-server-lambda");
var faunadb = require("faunadb"),
  q = faunadb.query;
const typeDefs = gql`
  type Query {
    todos: [Todo!]
  }
  type Todo {
    id: ID!
    task: String!
    status: Boolean!
  }
`;
const resolvers = {
  Query: {
    todos: async () => {
      try {
        var adminClient = new faunadb.Client({
          secret: "fnAD6jOBMOACBYsnWofZoXmjA9hpeCGckVF9JZwU",
        });
        const result = await adminClient.query(
          q.Map(
            q.Paginate(q.Match(q.Index('task'))),
            q.Lambda(x => q.Get(x))
          )

        );

console.log(result.ref.data)
return [{}]
      } catch (error) {
        console.log(error);
      }
    },
    // authorByName: (root, args) => {
    //   console.log('hihhihi', args.name)
    //   return authors.find((author) => author.name === args.name) || 'NOTFOUND'
    // },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = server.createHandler();

module.exports = { handler };
 