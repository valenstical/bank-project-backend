import _ from 'lodash';
import models from '../database/models';

export const filterQuery = (request, response, next) => {
  const { order } = request.query;
  const columns = _.keys(models.Transaction.rawAttributes);
  const where = _.pick(request.query, columns);
  response.locals.where = where;
  response.locals.order = [_.split(order || 'transactionDate,DESC', ',')];
  next();
};

export default {};
