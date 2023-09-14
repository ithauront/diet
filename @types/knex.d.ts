// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    dietLog: {
      id: string
      session_id?: string
      title: string
      description: string
      timeOfMeal: string
      dateOfMeal: string
      isPartOfDiet: string
    }
    users: {
      id: string
      userName: string
      userEmail: string
      userPassword: string
      created_at: string
      profileImage: string
    }
  }
}
