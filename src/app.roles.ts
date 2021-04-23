import { RolesBuilder } from 'nest-access-control';

export enum Role {
  AUTHOR = 'AUTHOR',
  ADMIN = 'ADMIN'
}

export enum Resource {
  USER = 'USER',
  POST = 'POST'
}

export const roles = new RolesBuilder();

roles
  // ATHOR ROLEs
  .grant(Role.AUTHOR)
  .updateOwn(Resource.USER)
  .deleteOwn(Resource.USER)
  .createOwn(Resource.POST)
  .deleteOwn(Resource.POST)
  .updateOwn(Resource.POST)
  // ADMIN ROLES
  .grant(Role.ADMIN)
  .extend(Role.AUTHOR)
  .createAny(Resource.USER)
  .updateAny([Resource.POST, Resource.USER])
  .deleteAny([Resource.POST, Resource.USER]);
