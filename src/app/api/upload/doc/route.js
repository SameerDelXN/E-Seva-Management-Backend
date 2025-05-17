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
  "private_key_id": "fb03175ebde87258348c1e5018d38c5dce155e61",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDDr/BTSKaIHhbp\n/CVtOndHDCc2KDeZrX5fTTLvxaeKCvOcM0+1TwWAjUgSzLYXo9inBF7ySAqN0FXM\nVMQW7qV1dUAagvpO01cnvmxgXZjFT1revJJJ0aohieCNL6oXvwqr0va5MLPBvXRo\n14/283U84NDSv43NKiPJ034jZxZp45RsN889QTeGC1RZ2M4w6Rk9Mn8/UbgzdDAR\nLEBj4ppqTPG5AP6zSRb9S/QtTfqGv7qnoSSVwAskxoPjtl1T3fzxE1MCOuPp9DDT\nHPE4JK38WJDyynatpcirMeSDdHC5sIKMGKxqBB6Yeq4Cxzs9iV/VXZIymWUR/oQ6\njjlLqoL5AgMBAAECggEANDEvSI9Gd2SLGQI62zyuRoFLzgqA9diLrZByBvhxPIS6\nP82Bs2ptncFQ2U7HPFvjc3xbdIRZaESKNbLgD/u7nq3UmJ2ZdD+y7bNAxZ0BG5MU\nOfcSj2S/2y0iepWdaLL3/icIzhDayNAmhbYEvEln2gJeP+9+OxvDqtdhO8EJfdkR\nOnr66J1kOFGV9mnqalF6E6wprWQHuZrREwaC2lUl9JBb4y6P6626n+mV0r500oK0\nBWujCdKolb4y5oEB1tC76A7n+r+/BgFp61AOcTOj8ofXnhKn9uxG9h+KFeZsCYb+\nbaLXb0V3ntpnH5rf9/o5EfqNIE+Wpxc4dnbso2b37wKBgQDjq03ueZNLvrii+aC6\nAFdcpjioSDz8A3owl4JD5+NeTqg7uISkBU6HTzjuao7y8L/DwvYBkA3b17oEvol6\nPyoE0UAVDfAlgkRdB+8q3SxpWOp2aVCXvbJOqP9FcaDxvOEpA/d/ViZuKav+kk+t\nXrVMmDHHfrftxRoRh5Gp6CJBuwKBgQDcCc9EsNcwEYzn0GR4+msUsF49BevhEDlY\nbar75LxlEahhYrckAso7tOVpiYkw4yr2vNZOQcyZhUMlJO1+y/5Dhgh6ipcnY6VB\nE6dPBKdr6I2+W6kD0GhwZwa3vcJzB7D3wyXedwp8F3W8HXZd5od97/x97Ki4v97a\nQ4MjYQxY2wKBgDzHhs6bdk9KY1BfBCGj5a6+UXHblyxQYVaHnCc0yOZsaU1IPWDs\nacKFy9UabX899nP0oGhaZNjEBs0tcNZJ9pXCpzD3v5zD4ixT6e2vjiOxsSZbh0B7\nTBbj1wJbC3R90D566J/+B9RxG5GizdKi7hO8rc1sbv3zGLqFTsXlSv/xAoGBANBb\nkaMv+XSRCeZxFNLh/gfnQjVyp/vEiyjLID/KRwNFhzZAbb9xzOJg12PqUriyQ/rE\nsgIEmKM+52gC4clRjYGPJ/QxzBQGbXOEEsfmVkr+OUpqLU9pR5w4UsomrDyUqeTT\nK8bO3mTHKjtpgq5EH0UHvQXY1aOsPHBdwY381d5FAoGBAIw8gcaN2KLJEnSkDT8T\nfZTtdKlfhefqNgv8aFe28Wmp0NhV3a2whehhEZubj4LxTmESMfapgamOW6zetUJO\nQHu2YAoVS4QWEGorv1BEAEjQf8IcNiZqEQUftTG4xSg23Uyzxfo9XK1UsxVWgnTX\nSwoSF+kIZeSRLw7vlv5t2g5y\n-----END PRIVATE KEY-----\n",
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
