import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('band_members', (table: Knex.TableBuilder) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('role').notNullable();
    table.text('bio');
    table.string('image_url');
    table.json('social_links');
    table.integer('display_order').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('band_members');
}