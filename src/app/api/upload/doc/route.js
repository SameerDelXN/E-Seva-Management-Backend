import { NextResponse } from "next/server";
import { google } from "googleapis";
import { Readable } from 'stream';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: CORS_HEADERS
  });
}

export async function POST(request) {
  try {
    // 1. Parse form data
    const formData = await request.formData();
    const file = formData.get("file");
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    console.log("File info:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // 2. Initialize Google Auth
    const auth = new google.auth.GoogleAuth({
      credentials: {
      "type": "service_account",
  "project_id": "dokumentguru",
  "private_key_id": "88e4b2c8f668073f59a5a0e26de29da3a0ea6b82",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC8P+yTwH40O2vI\nnXn0wbYJakbgqDvL0B5aK6TMYY8smamtusxBuQoX7R7zOUX59ASQrBF3ue/Eqzi5\nIQjeizEP9ZUlTZizMX6xa4H+JuwnOXAwXyON2oL3tq5cDVKQyLjv4pNNeu7TV1ZJ\nWg8q1uoSQqb2Bh6AIhq2NXhfe4umvaBrFEaaAHMkfkmbHRBaZ809qEknWcbELPzC\nqeed0pUY2ihjoGoOHlBxBeDUDh5rPvklstA2YwfbzrpVxg5D266jVs1TbPLcOK8A\nETWUp/rcClr8AkqgRFkeeaApceF6IUzy8dUjVeu6sBGini45q7KbK8BO5kD2F15/\ny8w/sFC1AgMBAAECggEAIPuIPUj0M72XgGJK/F22QccLnRAMzgRsVPshmCeduMBB\nkO1SHU/I23FRw2atAoLFC/4B33rF7izbtt/5WFiF45hxJcSHNRo+auJ9t6RlKugu\n5mK87X00BifNO9afuTtZ37nQejpIPuIl/ZsYXjaic0mXTDK9RFD1YihTK1OPn8p6\n+EiXJwd709DJ6xO6hgfpoQFkymC0j6XmYeio333bvEdvu4LnbcYPMFE4s1Llj8XK\nkQVmEM49CwbDXIzxtFIaydVhCyAEnXZmhFVKwobBv717aWveghIiwP1eBfuGOMye\nN1XVtp7bnXjPyOARwhOxGPWKDm/cGB5aesq2JtF4wQKBgQD8BseYdEF+C77+HaGv\nn4sTs3S9+C1P1hX8rT+CzGawye9FmXsPhEgHPaF+OQcroPlE6i8OWWtPZCrHu9Bf\nUCKOvXtkQoVj6dGGFRMzoCfYPdI02THzOvgwdqq5L0T8H9C+zzMLFw7Z9u195H7I\ned+Fbk5kvAAbwt9qep97i66F1QKBgQC/N7sbmeBhaMWWg+CVNMKrc4ygiWDnPkvW\nm8Na3CxstGwBhjA2armVDOb0SjetHXf1yIqLSsYeNwMatsH8u5EaXsINhgSJSNE3\ndcgV6bh6q+GCDGa7heDNWChIJC1+SbKNOgFnry8hc+9n/wD2S1SmccZcO2eqjo+/\nd9eVy0evYQKBgQDd4o4pn/jlIyxFCAuI1psYfj+C3RPvnRmAe3tWCeVDMpYxHZ5l\nm93aWh1rRoQUmkW7sb46EOnUXOj5LlaXA7NZHmObcqGDxKDOPpHIOvG5hTwjgTFj\n5oAKEv/dyEsg+lXLGBrlYaiWp7qRwvEISZxMGkB0mbwytNAEK+9rUyAU/QKBgHFv\nQEJJcICYxM5bgXlCCVHohD4gASptHFQ9pxBZmMkL5x6oWiWN/nXbZ474EDtURfu6\nceXb/9egzuikDkQ9iQDZwch//mTqm6KI7p+BPP0Yxfh+HtuTuh5W896IB6zpT1DU\nXk0B8bWorxdEgW+alKcAy6mfXAoj9Eajc3LbWrVBAoGAGSSBn5Pp689fwEl9RKkm\nbQlVpBRCtdMqDkmmiGAwBxC/xXqNlBC1E42EMQOjjc1NPUF43Cps8BjQHxIE1Ot0\nM31jAugo4K3reIxTb3wh/h1Fs0D3aqu2FMTaC3rXINAvKEbx6g1LlRcjiU/8v2/m\nE7P/MuuiFtrGv/C7n2EYtks=\n-----END PRIVATE KEY-----\n",
  "client_email": "dokumentguru@dokumentguru.iam.gserviceaccount.com",
  "client_id": "101763414526992231249",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/dokumentguru%40dokumentguru.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
      },
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    // 3. Create drive client
    const drive = google.drive({ version: 'v3', auth });

    // 4. Convert file to stream
    const buffer = await file.arrayBuffer();
    const stream = new Readable();
    stream.push(Buffer.from(buffer));
    stream.push(null); // End of stream

    // 5. Upload to Google Drive
    const response = await drive.files.create({
      requestBody: {
        name: file.name,
        mimeType: file.type,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
      },
      media: {
        mimeType: file.type,
        body: stream,
      },
    });

    console.log("Upload response:", response.data);

    // 6. Set permissions
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    const fileUrl = `https://drive.google.com/uc?export=view&id=${response.data.id}`;

    return NextResponse.json({
      success: true,
      documentUrl: fileUrl,
      documentId: response.data.id,
    }, { headers: CORS_HEADERS });

  } catch (error) {
    console.error("Full error:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });

    return NextResponse.json(
      { 
        error: "Failed to upload document",
        details: error.message,
        ...(error.response?.data && { googleError: error.response.data })
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}