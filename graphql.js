const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    inventory: [Inventory!]!
    inventoryByFlavor(flavor: String!): [Inventory!]!
    inventoryByShop(shop: String!): [Inventory!]!
    inventoryByDate(date: String!): [Inventory!]!
  }

  type Mutation {
    addInventory(inventory: InventoryInput!): Inventory!
  }

  input InventoryInput {
    shop: ShopInput!
    employee: EmployeeInput!
    icecream: IcecreamInput!
    date: String!
  }

  input IcecreamInput {
    flavor: String!
    count: Int!
    is_season_flavor: Boolean!
  }

  input ShopInput {
    name: String!
  }

  input EmployeeInput {
    name: String!
  }

  type Icecream {
    flavor: String!
    count: Int!
    is_season_flavor: Boolean!
  }

  type Inventory {
    shop: Shop!
    employee: Employee!
    icecream: Icecream!
    date: String!
  }

  type Shop {
    name: String!
  }

  type Employee {
    name: String!
  }
`;

const inventoryData = [
  {
    shop: { name: 'Tienda A' },
    employee: { name: 'Empleado 1' },
    icecream: { flavor: 'Chocolate', count: 10, is_season_flavor: false },
    date: '2023-10-07',
  },
];

const resolvers = {
  Query: {
    inventory: () => inventoryData,
    inventoryByFlavor: (_, { flavor }) =>
      inventoryData.filter((item) => item.icecream.flavor === flavor),
    inventoryByShop: (_, { shop }) =>
      inventoryData.filter((item) => item.shop.name === shop),
    inventoryByDate: (_, { date }) =>
      inventoryData.filter((item) => item.date === date),
  },
  Mutation: {
    addInventory: (_, { inventory }) => {
      inventoryData.push(inventory);
      return inventory;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen(4000).then(({ url }) => {
  console.log(`Servidor GraphQL listo en ${url}`);
});
