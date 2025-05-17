import { NextResponse } from "next/server";
import { google } from "googleapis";
import { Readable } from 'stream'; // ✅ Add this import

export const runtime = 'nodejs'; // 🔑 Crucial for Vercel
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400'
};


export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS
  });
}
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    console.log("file - ",file)
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, {
          status: 400,
          headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json'
          }
        });
    }

    const auth = new google.auth.GoogleAuth({
  credentials: {
     "type": "service_account",
  "project_id": "dokumentguru",
  "private_key_id": "10d6b19c6bbdd1661cf07dbafb0e9c599e958150",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCJw3fO5OHxT4zk\niWK/X0ZZ1bWIuUuVzitJ4kBSgIO2bXY/sbPrs3S5O2T+WkQZ+5YQc01e7mkhFeJl\n9hcSunh7OSpIUkCZkrJNxQsF/acOPm3FBdA7r8mmtUG0/cb1Wg7/Ekm5UC7S5GZj\nBV2HW5/ejNGIhEQIxH4gwa1tCyqR/xjOQ+9+2bJGep5k1vuw+FuY5ve3MmqD7QSe\nl4o65Bn3yHfVVLbaiZZGNyos7rqqel2802y3w0FEhuWSxUo/3mX5eMojh5dilaNh\nS4yYRrNANphXUoV7Akba1a6PTklV2uzmWeJb49sKGbEH9x5ZtAFOiFTRjajSnrz1\n1S138tYDAgMBAAECggEAGo9H2uh/swFOPYVLN3AL5SfxjsGClAgiimUHV6CVRCeI\nY7FD6c44U7nit7L5bDT38oX4RbQbKpjIhDXUrvSqY79aqoTJFZKVs66oeGg1u+ZH\nTXPYeJlkfDJ3z4gZwpWxTHXfJs4RqPEF2FNhe8YrZUGq5/HwF+yiEHimkd5UP78x\nPXQfzMp4cgM9r9DroAkEDqyVJsKICAP0CvQe0iPT5uZiWAxzNQivo9KfyM+vAsb2\nzj8ztjwm9qrmPcVLohRgEgDalCGHHJu6OjbmFcXqgr4SFfUiIDW6P58kElukyp48\nz1Gcqr92dn2YCq/T1gLiN0DZ0dBO4JkZAU2famCyqQKBgQDBEN9/X9Lo3CvQazff\nGfmUcOz85s4k3TjUVEie9ws3RjV7Pa3upCHl5ffo+b9c7y1XCOm9ue6LOSqPv/dl\nkDip/tt6XpbUR6WW+2UVQ3PvMkHDOOQBiW1rGBIrB7ycLFVFU8MyzbWvSxdhyObo\nZhcL/R1HsFL7sX0eD6Z/tjaVtQKBgQC2q607M2IuH7E4H0uGfvPVxU/Uc+K0wJ5D\nzb0+5dzbGenXZ4Pd7DX0Uleyl8rlAZZhTncGwQzUn0UjVtsTPRxcRxob0efNQNmA\nRd1iEFH642A4YLjKjAPhYuZzRR4+1bN02PzXyWvh1ZQt5AhRjPSVUVslEKcpMMYB\n99uNhW+P1wKBgAevlUYr2WidwzzD1/CQxyfKqxSSV6iOCgIh7NYvPYoQyHZEiVUT\nwam2Uv06XAzmFKb/WtbLvRxbxT79xGqNqEPUOoaPl2+R/pyZG3gSPF5MYOPVsvYA\ns5Ns3ORLpY2OEkL1R7MRD2eQFLk210JvNgGrLOw6r8MHWNTGiLlS1q91AoGAE80I\nOiKXwegtjafWx/168PEydhUZvf4jKbZjjS3dguKMNo1B/gxczN8gInvRwoEpi+K1\nhEXo3iNlmy8PEEbPjDEo41sdhWJCMWVhWf/q4wdCptnVLh9/TC8sS9JyNN11VnUu\n8zUiPJiqN09Al5Zv7L+k4Z+sfwqKbCwx4GVWcoECgYBzB5rtEvbQcrzHVvZmxVDF\naPCqCfa5F5ZICcIZKRfS97lVGkytKSw+sWxf7Bs8kPz5GWzb/vsglDCF6gWrj9KD\nBQXFY5ZJr2h6MByvGKhDmOj7HToelrQ1LixUna0tF4BSrJ7SNhQvwPPhVfnB80Ar\nn+dZe/2tDbZCfgKva82YVw==\n-----END PRIVATE KEY-----\n",
  "client_email": "dokumentguru@dokumentguru.iam.gserviceaccount.com",
  "client_id": "101763414526992231249",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/dokumentguru%40dokumentguru.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
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
    },{
        status: 200,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/json'
        }
      });

  } catch (error) {
    console.error("Google Drive upload error:", error);
    return NextResponse.json({
      error: "Failed to upload document",
      details: error.message,
    },  {
        status: 500,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/json'
        }
      });
  }
}
