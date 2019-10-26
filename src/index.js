import { GraphQLServer } from 'graphql-yoga';

// demo user data
const users = [
  {
    id: '1',
    name: 'hero',
    email: 'hero@yahoo.com',
    age: 27
  },
  {
    id: '2',
    name: 'mike',
    email: 'mike@yahoo.com',
    age: 24
  },
  {
    id: '3',
    name: 'jd',
    email: 'jd@yahoo.com',
    age: 28
  }
];

const posts = [
  {
    id: 1,
    title: 'sample1',
    body: 'this is my sample1 body s1',
    published: true,
    author: '1'
  },
  {
    id: 2,
    title: 'sample2',
    body: 'this is my sample2 body s2',
    published: true,
    author: '1'
  },
  {
    id: 3,
    title: 'sample3',
    body: 'this is my sample3 body s3',
    published: true,
    author: '2'
  }
];

// Type definition (schema)
const typeDefs = `
    type Query {
        add(a: Int!, b:Int!): Int!
        users(query: String): [User!]
        posts(query: String): [Posts!]
        post: Posts!
    }
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Posts!]!
    }
    type Posts {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
    }
`;
// Resolvers must exact name
const resolvers = {
  Query: {
    add(parent, args, ctx, info) {
      return args.a + args.b;
    },
    users(parents, arg, ctx, info) {
      if (!arg.query) {
        return users;
      }
      return users.filter(user => {
        return user.name.toLowerCase().includes(arg.query.toLowerCase());
      });
    },
    posts(parents, args, ctx, info) {
      if (!args.query) {
        return posts;
      }
      return posts.filter(post => {
        const titleMatch = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const bodyMatch = post.body
          .toLowerCase()
          .includes(args.query.toLowerCase());
        return titleMatch || bodyMatch;
      });
    },
    post() {
      return {
        id: 'abc123',
        title: 'new Post',
        body: 'my post is great and awesome',
        published: false,
        author: '1'
      };
    }
  },
  Posts: {
    author(parent, arg, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    }
  },
  Users: {
    post(parent, arg, ctx, info) {
      return posts.filter(post => {
        return post.author === parent.id;
      });
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log('server is running');
});
