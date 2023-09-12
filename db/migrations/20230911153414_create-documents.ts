import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('dietLog', (table) => {
    table.uuid('id').primary()
    table.uuid('session_id')
    table.text('title').notNullable()
    table.text('description').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.string('isPartOfDiet').checkIn(['yes', 'no']).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('dietLog')
}
