import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { questionEngineFunction } from "../functions/question-bedrock/resource"
const schema = a.schema({

  analyseAnswer: a
    .query()
    .arguments({ prompt: a.string().required() })
    .returns(a.string())
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(questionEngineFunction)),

  publish: a.mutation()
    .arguments({
      channelName: a.string().required(),
      content: a.string().required()
    })
    .returns(a.ref('Message'))
    .handler(a.handler.custom({ entry: './publish.js' }))
    .authorization(allow => [allow.authenticated(), allow.publicApiKey()]),

    
  receive: a.subscription()
    // subscribes to the 'publish' mutation
    .for(a.ref('publish'))
    // subscription handler to set custom filters
    .handler(a.handler.custom({ entry: './receive.js' }))
    // authorization rules as to who can subscribe to the data
    .authorization(allow => [allow.authenticated(), allow.publicApiKey()]),

  Message: a.customType({
    content: a.string().required(),
    channelName: a.string().required()
  }),

  BedrockResponse: a.customType({
    body: a.string(),
    error: a.string(),
  }),

  askBedrock: a
    .query()
    .arguments({ informations: a.string().array() })
    .returns(a.ref("BedrockResponse"))
    .authorization((allow) => [allow.authenticated()])
    .handler(
      a.handler.custom({ entry: "./bedrock.js", dataSource: "bedrockDS" })
    ),

  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.authenticated()]),

  identifyText: a
    .query()
    .arguments({
      path: a.string(),
    })
    .returns(a.string())
    .authorization((allow) => [allow.authenticated()])
    .handler(
      a.handler.custom({
        entry: "./identifyText.js",
        dataSource: "RekognitionDataSource",
      })
    ),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});