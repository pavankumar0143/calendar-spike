/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    // Create users table to store user information
    .createTable('appointment_calendar_users', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('email').notNullable().unique();
      table.string('name').notNullable();
      table.string('google_calendar_id');
      table.string('google_refresh_token');
      table.string('google_access_token');
      table.timestamp('google_token_expiry');
      table.boolean('is_calendar_connected').defaultTo(false);
      table.timestamps(true, true);
    })
    
    // Create appointments table
    .createTable('appointment_calendar_appointments', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('user_id').references('id').inTable('appointment_calendar_users').onDelete('CASCADE');
      table.string('title').notNullable();
      table.text('description');
      table.timestamp('start_time').notNullable();
      table.timestamp('end_time').notNullable();
      table.string('google_event_id');
      table.string('location');
      table.string('status').defaultTo('scheduled'); // scheduled, cancelled, completed
      table.timestamps(true, true);
    })
    
    // Create availability table
    .createTable('appointment_calendar_availability', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('user_id').references('id').inTable('appointment_calendar_users').onDelete('CASCADE');
      table.integer('day_of_week').notNullable(); // 0-6 (Sunday-Saturday)
      table.time('start_time').notNullable();
      table.time('end_time').notNullable();
      table.boolean('is_available').defaultTo(true);
      table.timestamps(true, true);
      
      // Unique constraint to prevent duplicate availability entries
      table.unique(['user_id', 'day_of_week', 'start_time', 'end_time']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('appointment_calendar_availability')
    .dropTableIfExists('appointment_calendar_appointments')
    .dropTableIfExists('appointment_calendar_users');
}; 