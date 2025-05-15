import { NextResponse } from "next/server";
import { google } from "googleapis";
import { Readable } from 'stream'; // ✅ Add this import

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    console.log(file)
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const auth = new google.auth.GoogleAuth({
  credentials: {
    type: "service_account",
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.GOOGLE_CLIENT_EMAIL)}`,
    universe_domain: "googleapis.com"
  },
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});


    const drive = google.drive({ version: 'v3', auth });
    const buffer = await file.arrayBuffer();
    const stream = Readable.from(Buffer.from(buffer)); // ✅ Convert to stream

    const response = await drive.files.create({
      requestBody: {
        name: file.name,
        mimeType: file.type,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
      },
      media: {
        mimeType: file.type,
        body: stream, // ✅ Use stream here
      },
    });

    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    const fileUrl = `https://drive.google.com/file/d/${response.data.id}/view?usp=sharing`;

    return NextResponse.json({
      success: true,
      documentUrl: fileUrl,
      documentId: response.data.id,
    });

  } catch (error) {
    console.error("Google Drive upload error:", error);
    return NextResponse.json({
      error: "Failed to upload document",
      details: error.message,
    }, { status: 500 });
  }
}
