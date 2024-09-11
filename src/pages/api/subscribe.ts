import type { APIRoute } from "astro";

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
    // console.log(email)

     // Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate input (if email is missing or invalid)
    if (!email || !emailRegex.test(email)) {
      return new Response(JSON.stringify({ message: "Email is required" }), {
        status: 400, // Bad Request
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch existing subscribers
    const response = await fetch("http://localhost:1337/api/subscribers");
    const data = await response.json();
    // console.log(data)
    const existingEmails = data.data.map(
      (subscriber: any) => subscriber?.attributes?.email
    );

    // check if email exists
    if (existingEmails.includes(email)) {
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

    // Add subscriber to strapi 
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
      console.log(strapiData.error);
      throw new Error(strapiData.error?.message || "Subscription failed");
    }
  } catch (error) {
    // console.error("Error adding subscriber:", error);
    // console.log((error as Error)?.message);
    return new Response(
      JSON.stringify({ message: (error as Error)?.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};