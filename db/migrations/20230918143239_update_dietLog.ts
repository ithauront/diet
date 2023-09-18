import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('dietLog', (table) => {
    table.uuid('userId').references('id').inTable('users').after('id')
    table.dropColumn('session_id')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('dietLog', (table) => {
    table.uuid('session_id')
    table.dropColumn('userId')
  })
}
