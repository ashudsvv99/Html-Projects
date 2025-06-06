exports.up = function(knex) {
  return knex.schema.createTable('journal_entries', function(table) {
    table.increments('id').primary();
    table.date('date').notNullable();
    table.json('morning_checklist').notNullable();
    table.json('daily_practices').notNullable();
    table.json('evening_checklist').notNullable();
    table.integer('mood').notNullable();
    table.integer('energy').notNullable();
    table.text('notes');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('journal_entries');
};
