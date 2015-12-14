import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema
} from 'graphql';

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'MyQuery',
    fields: () => ({
      echo: {
        type: GraphQLString,
        args: {
          message: {type: GraphQLString}
        },
        resolve: (root, {message}) => {
          return `Echo: ${message}`;
        }
      }
    })
  })
});

export default schema;
