import { defineDb, column, defineTable } from 'astro:db';

export const Subscriber = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    email: column.text({ unique: true }),
    createdAt: column.date({ default: new Date() }),
  }
});

// https://astro.build/db/config
export default defineDb({
  tables: { Subscriber }
});
