import { defineStorage } from '@aws-amplify/backend';

export const firstBucket = defineStorage({
  name: 'firstBucket',
  access: (allow) => ({
    'media/*': [allow.authenticated.to(['read', 'write', 'delete'])],
    'public/*': [
      allow.guest.to(['list', 'write', 'get'])
    ]
  })
});

export const secondBucket = defineStorage({
  name: 'secondBucket',
  access: (allow) => ({
    'private/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete'])
    ]
  })
})

export const storage = defineStorage({
  name: "predictions_gen2",
  access: allow => ({
    'public/*': [
      allow.guest.to(['list', 'write', 'get'])
    ]
  })
})