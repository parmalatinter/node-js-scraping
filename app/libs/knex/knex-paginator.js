/**
 * https://gist.githubusercontent.com/ionutmilica/6141bc95a65d57b1572ab21ef34ba5e4/raw/edb2105378a5bc4022033597248880190aee9e61/knex-paginator.js
 *
 * Usage:
 * const paginator = require('./knex-paginator.js');
 * const ticketsQuery = knex('tickets').select('*').orderBy('created_at', 'ASC');
 * paginator(knex)(ticketsQuery, {
 * perPage: 1,
 * }).then(({ data, pagination }) => {
 * console.log(data, pagination);
 * }).catch(err => {
 * console.log(err);
 * });
 *
 * @param knex
 *
 * @returns {function(*, *)}
 */
module.exports = (knex) => {
	return async (query, options) => {
		const perPage = options.perPage || 20;
		let page = options.page || 1;

		const countQuery = knex.count('* as total').from(query.clone().as('inner'));

		if (page < 1) {
			page = 1;
		}
		const offset = (page - 1) * perPage;

		query.offset(offset);

		if (perPage > 0) {
			query.limit(perPage);
		}

		const [data, countRows] = await Promise.all([
			query,
			countQuery
		]);

		const total = countRows[0].total;

		return {
			pagination: {
				total: Number(total),
				perPage,
				currentPage:  Number(page),
				lastPage: Math.ceil(total / perPage),
				from: offset,
				to: offset + data.length,
			},
			data: data
		};
	};
};