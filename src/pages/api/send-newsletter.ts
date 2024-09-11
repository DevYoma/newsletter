import type { APIRoute } from "astro";
import nodemailer from 'nodemailer';

export const GET: APIRoute = async () => {
    return new Response(JSON.stringify({
        message: "Working 🫵"
    }))
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { subject, content } = await request.json();

    // Fetch subscribers from Strapi
    const subscribersResponse = await fetch('http://localhost:1337/api/subscribers');
    const subscribersData = await subscribersResponse.json();
    const subscribers = subscribersData.data.map((sub: any) => sub.attributes.email);

    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: import.meta.env.SMTP_HOST,
      port: import.meta.env.SMTP_PORT,
      secure: import.meta.env.SMTP_SECURE,
      auth: {
        user: import.meta.env.SMTP_USER,
        pass: import.meta.env.SMTP_PASS,
      },
    });

    // Send emails to all subscribers
    for (const email of subscribers) {
      await transporter.sendMail({
        from: '"Yoma\'s Dispatch: Code & Beyond" <lawrenceyoma@gmail.com>',
        to: email,
        subject: subject, 
        text: content, 
        // html: "<b>Hello world?</b>", // html body
      });
    }

    return new Response(JSON.stringify({ message: 'Newsletter sent successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error sending newsletter:', error);
    return new Response(JSON.stringify({ message: 'Error sending newsletter' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};