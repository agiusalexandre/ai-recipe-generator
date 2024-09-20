import { defineStorage } from '@aws-amplify/backend';

export const firstBucket = defineStorage({
  name: 'firstBucket',
  isDefault: true,
  access: (allow) => ({
    'media/{entity_id}/*': [allow.authenticated.to(['read', 'write', 'delete'])],
    'public/*': [
      allow.guest.to(['list', 'write', 'get'])
    ]
  })
});