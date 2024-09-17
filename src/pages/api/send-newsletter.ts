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
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <div style="background-color: #f4f4f4; padding: 20px;">
              <h2 style="color: #2c3e50; text-align: center;">Yoma's Dispatch: Code & Beyond</h2>
            </div>
            
            <div style="padding: 20px;">
              <p style="font-size: 16px;">Hello,</p>
              <p style="font-size: 16px; line-height: 1.5;">
                ${content} <!-- This is the main content of your email -->
              </p>
              
              <div style="margin-top: 30px;">
                <p style="font-size: 14px; color: #555;">
                  Stay tuned for more exciting insights in tech, coding, and personal growth.
                </p>
                <p style="font-size: 14px; color: #555;">
                  Best regards,<br/>
                  Yoma from <strong>Code & Beyond</strong>
                </p>
              </div>
            </div>
            
            <div style="background-color: #f4f4f4; padding: 10px; text-align: center;">
              <p style="font-size: 12px; color: #888;">
                If you no longer wish to receive these emails, you can 
                <a href="https://yourunsubscribeurl.com" style="color: #3498db;">unsubscribe here</a>.
              </p>
            </div>
          </div>
        `
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