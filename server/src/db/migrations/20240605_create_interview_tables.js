exports.up = function(knex) {
  return knex.schema
    .createTable('interview_questions', function(table) {
      table.increments('id').primary();
      table.string('category').notNullable();
      table.string('difficulty').notNullable();
      table.text('question').notNullable();
      table.text('answer').notNullable();
      table.text('notes');
      table.boolean('is_reviewed').notNullable().defaultTo(false);
      table.timestamp('last_reviewed');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('mock_interviews', function(table) {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.timestamp('scheduled_for').notNullable();
      table.integer('duration').notNullable();
      table.json('topics').notNullable();
      table.text('notes');
      table.boolean('is_completed').notNullable().defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('interview_resources', function(table) {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.string('type').notNullable();
      table.text('content').notNullable();
      table.string('category').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('interview_questions')
    .dropTable('mock_interviews')
    .dropTable('interview_resources');
};
