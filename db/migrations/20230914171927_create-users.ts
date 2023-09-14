import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary()
    table.text('userName').notNullable()
    table.text('userEmail').notNullable().unique()
    table.text('userPassword').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.text('profileImage') // not going to use this because I would have to use an API from a image storage system and the front-end didn't specify how the creation of user was, but since I saw an user image I put this column in the table just to be accurate
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}
