exports.up = function(knex) {
  return knex.schema
    .createTable('concept_cards', function(table) {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.text('description');
      table.json('tags').notNullable();
      table.string('status').notNullable().defaultTo('Draft');
      table.json('related_courses').notNullable();
      table.json('related_projects').notNullable();
      table.json('related_journals').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('flashcard_decks', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.text('description');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('flashcards', function(table) {
      table.increments('id').primary();
      table.text('question').notNullable();
      table.text('answer').notNullable();
      table.integer('deck_id').unsigned().references('id').inTable('flashcard_decks').onDelete('CASCADE');
      table.string('difficulty').notNullable().defaultTo('Medium');
      table.timestamp('last_reviewed');
      table.timestamp('next_review');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('ideas', function(table) {
      table.increments('id').primary();
      table.text('content').notNullable();
      table.string('category').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('flashcards')
    .dropTable('flashcard_decks')
    .dropTable('ideas')
    .dropTable('concept_cards');
};
