//  src\pages\api\send-email.ts

import { ErrorResponse, Resend } from "resend";
import { NextApiRequest, NextApiResponse } from "next";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const { name, email, message } = req.body as ContactFormData;
  if (!name || !email || !message) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const { data, error } = await resend.emails.send({
      from: "Cashclips Contact <contact@email.cashclips.io>",
      to: ["cashclips.cc@gmail.com"],
      subject: `New contact form submission from ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
<table role="presentation" style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; color: #000000;">
  <tr>
    <td style="padding: 20px;">
      <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #000000;">
        <tr>
          <td style="background-color: #000000; padding: 20px; text-align: center;">
            <img src="https://cashclips.io/logo.png" alt="Cashclips Logo" style="max-width: 150px; height: auto;">
          </td>
        </tr>
        <tr>
          <td style="padding: 20px;">
            <h1 style="margin-bottom: 20px; font-size: 24px;">New Contact Form Submission</h1>
            <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 10px; border: 1px solid #000000;">
                  <p style="margin: 0;"><strong>Name:</strong> ${name}</p>
                </td>
              </tr>
            </table>
            <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 10px; border: 1px solid #000000;">
                  <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
                </td>
              </tr>
            </table>
            <h2 style="margin-top: 30px; margin-bottom: 15px; font-size: 20px;">Message:</h2>
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 15px; border: 1px solid #000000;">
                  <p style="margin: 0; white-space: pre-wrap;">${message}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 14px;">
            <p style="margin: 0;">This is an automated message from your contact form.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
      `,
      tags: [
        {
          name: "category",
          value: "contact_form",
        },
      ],
    });

    if (error as ErrorResponse) {
      console.error("Error sending email:", error);
      return res
        .status(400)
        .json({ message: error?.message, name: error?.name });
    }
    res.status(200).json({ message: "Email sent successfully", id: data?.id });
  } catch (error) {
    console.error("Unexpected error:", error);
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: error.message, name: "unexpected_error" });
    } else {
      res.status(500).json({
        message: "An unexpected error occurred",
        name: "internal_server_error",
      });
    }
  }
}
