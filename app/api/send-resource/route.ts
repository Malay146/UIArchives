import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, title, description, webLink, github, twitter } = body;

    // Validate required fields (only name, email, and title are required)
    if (!name || !email || !title) {
      return NextResponse.json(
        { error: "Please fill in all required fields (name, email, and title)" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Debug: Log environment variables (remove in production)
    console.log("Environment check:", {
      hasHost: !!process.env.SMTP_HOST,
      hasPort: !!process.env.SMTP_PORT,
      hasUser: !!process.env.SMTP_USER,
      hasPass: !!process.env.SMTP_PASS,
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
    });

    // Use environment variables
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const toEmail = process.env.TO_EMAIL || process.env.SMTP_USER;

    // Verify SMTP credentials are available
    if (!smtpUser || !smtpPass) {
      console.error("Missing SMTP credentials in environment variables");
      return NextResponse.json(
        { error: "Server configuration error. SMTP credentials not found." },
        { status: 500 }
      );
    }

    console.log("Using SMTP config:", { smtpHost, smtpPort, smtpUser, toEmail });

    // Create transporter using environment variables
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    // Verify transporter connection
    try {
      await transporter.verify();
      console.log("SMTP connection verified successfully");
    } catch (verifyError) {
      console.error("SMTP verification failed:", verifyError);
      return NextResponse.json(
        { error: "Email service unavailable. Please try again later." },
        { status: 503 }
      );
    }

    // Email content
    const mailOptions = {
      from: `"UI Vault Resource" <${smtpUser}>`,
      to: toEmail,
      subject: `New Resource Submission: ${title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">New Resource Submission</h2>
            
            <div style="margin-top: 20px;">
              <h3 style="color: #4F46E5; margin-bottom: 10px;">Resource Details</h3>
              <p style="margin: 8px 0;"><strong>Title:</strong> ${title}</p>
              ${description ? `<p style="margin: 8px 0;"><strong>Description:</strong> ${description}</p>` : ""}
              ${webLink ? `<p style="margin: 8px 0;"><strong>Website:</strong> <a href="${webLink}" style="color: #4F46E5;">${webLink}</a></p>` : ""}
            </div>

            <div style="margin-top: 20px;">
              <h3 style="color: #4F46E5; margin-bottom: 10px;">Submitter Information</h3>
              <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #4F46E5;">${email}</a></p>
            </div>

            ${github || twitter ? `
            <div style="margin-top: 20px;">
              <h3 style="color: #4F46E5; margin-bottom: 10px;">Social Links</h3>
              ${github ? `<p style="margin: 8px 0;"><strong>GitHub:</strong> <a href="${github}" style="color: #4F46E5;">${github}</a></p>` : ""}
              ${twitter ? `<p style="margin: 8px 0;"><strong>Twitter:</strong> <a href="${twitter}" style="color: #4F46E5;">${twitter}</a></p>` : ""}
            </div>
            ` : ""}

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
              <p style="color: #666; font-size: 12px; margin: 0;">
                This email was sent from the UI Vault resource submission form.
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
New Resource Submission

Resource Details:
Title: ${title}
${description ? `Description: ${description}` : ""}
${webLink ? `Website: ${webLink}` : ""}

Submitter Information:
Name: ${name}
Email: ${email}

${github || twitter ? `Social Links:
${github ? `GitHub: ${github}` : ""}
${twitter ? `Twitter: ${twitter}` : ""}` : ""}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: "Resource submitted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send resource submission. Please try again later." },
      { status: 500 }
    );
  }
}
