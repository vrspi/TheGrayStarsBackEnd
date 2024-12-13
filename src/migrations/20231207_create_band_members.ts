import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('band_members', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('role').notNullable();
    table.string('image').notNullable();
    table.string('bio').notNullable();
    table.json('social_links').notNullable();
    table.integer('display_order').notNullable().defaultTo(0);
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('band_members');
} 