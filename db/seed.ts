import { db, Subscriber } from 'astro:db';

// https://astro.build/db/seed
export default async function seed() {
	// TODO
	await db.insert(Subscriber).values([
    {
      email: "john.doe@example.com",
      createdAt: new Date("2023-01-15T10:30:00Z"),
    },
    {
      email: "jane.smith@example.com",
      createdAt: new Date("2023-02-20T14:45:00Z"),
    },
  ]);
}
