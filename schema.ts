import User from './schemas/user';
import Article from './schemas/article';
import Category from './schemas/category';

import type { Lists } from '.keystone/types';

export const lists: Lists = {
  User,
  Article,
  Category,
};
