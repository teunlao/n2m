// import {Contract, createJsonQuery, declareParams, DynamicallySourcedField, Validator} from '@farfetched/core'
//
// type GraphQLQueryConfig = {
//   request: {
//     url: string
//     graphQL: {
//       query: any
//       variables: (params: any) => any
//     }
//   }
// }
//
// export function createGraphQLQuery(config: GraphQLQueryConfig) {
//   const query = createJsonQuery({
//     ...config,
//     request: {
//       ...config.request,
//       method: 'POST',
//       response:
//       query: {},
//       body: (params) => ({
//         query: config.request.graphQL.query,
//         variables: config.request.graphQL.variables(params),
//       }),
//     },
//   })
//
//   return query
// }
