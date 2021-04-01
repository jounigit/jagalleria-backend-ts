import { AccessControl } from 'ts-access-control'

const grantObject = {
  admin: {
    album: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    category: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
  },
  editor: {
    album: {
      'create:own': ['*'],
      'read:own': ['*'],
      'update:own': ['*'],
      'delete:own': ['*'],
    },
    category: {
      'create:own': ['*'],
      'read:own': ['*'],
      'update:own': ['*'],
      'delete:own': ['*'],
    }
  }
}

export const ac = new AccessControl(grantObject)

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const accessGranted = (userID: string, docID: string, role: string, resource: string) => {
  return (userID === docID.toString())
    ? ac.can(role).updateOwn(resource)
    : ac.can(role).updateAny(resource)
}