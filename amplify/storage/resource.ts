import { defineStorage } from '@aws-amplify/backend';

export const firstBucket = defineStorage({
  name: 'firstBucket',
  isDefault: true,
});

export const secondBucket = defineStorage({
  name: 'secondBucket',
  access: (allow) => ({
    'private/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete'])
    ]
  })
})