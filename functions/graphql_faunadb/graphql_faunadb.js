const { ApolloServer, gql } = require("apollo-server-lambda");
const faunadb = require('faunadb'),
  q = faunadb.query;


const typeDefs = gql`
  type Query {
    message: String
  }
`;



const resolvers = {
  Query: {
    message: async (parent, args, context) => {
      try {
        var client = new faunadb.Client({ secret: "fnAD6M-o9uACB4lYdz8SDfauG0rT2BnCDJSx0GjY"});
        let result = await client.query(
          q.Get(q.Ref(q.Collection('products'), '281703287913185799'))
        );
        
        return result.data.name;
      } catch (err) {
        return err.toString();
      }
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true
});

exports.handler = server.createHandler();