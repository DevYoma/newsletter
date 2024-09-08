import type { APIRoute } from "astro";
import { db, Subscriber, eq } from "astro:db";

export const GET: APIRoute = async () => {
    try {
      const response = await fetch("http://localhost:1337/api/subscribers");
      const data = await response.json();

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.log('Error fetching subscribers', error);
      return new Response(JSON.stringify({message: "Error fetching subscribers"}), {
        status: 500, 
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
}

export const POST: APIRoute = async ({ request }) => {

  try {
    const body = await request.json();
    const { email } = body;
    console.log(email)

    // Fetch existing subscribers
    const response = await fetch("http://localhost:1337/api/subscribers");
    const data = await response.json();
    const existingEmails = data.data.map((subscriber: any) => subscriber?.attribute?.email)

    // check if email exists
    if(existingEmails.includes(email)){
      return new Response(
        JSON.stringify({ message: "Email is already registered" }),
        {
          status: 409, // Conflict status code
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const strapiResponse = await fetch(
      "http://localhost:1337/api/subscribers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: { email } }),
      }
    );

    const strapiData = await strapiResponse.json();

    if (strapiResponse.ok) {
      return new Response(
        JSON.stringify({ message: "Thank you for subscribing!" }),
        {
          status: 201,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      console.log(strapiData.error.details)
      throw new Error(strapiData.error?.message || "Subscription failed");
    }
  } catch (error) {
    console.error("Error adding subscriber:", error);
    console.log(error);
    return new Response(
      JSON.stringify({ message: "Error adding subscriber" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};