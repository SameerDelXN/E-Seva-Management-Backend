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
        "type": "service_account",
  "project_id": "dokumentguru",
  "private_key_id": "7a6baa201800e60296c262001bac6e6a09e03877",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCaGVdnLl3xrOul\n+60FApzgGpqJkiEsDdITQv9J/n3+bXPMiIbYn5YKcx/xqmhfmpNMV0Mw4UAfXF52\nsO1niLlSMS0rWMBjztrmITfnZOOHAIutFKP0qg2foIU0UHtkL1ngS4ATuxy4HUYb\nTU1BrmI0Vv/6Z6UMzZ/BldQ/ByIZNUw2YCyj3ZLfAxSEWVyHt+LrQgNEIQYyJ/J/\nB2haV/MfGTNmeHsJj/apdHg412loNWt/JZ+savJmphvIHPkdiJg4b23eIY+/lQfj\nYFdySH3RuGZ09RVPT3FKeQFd1M4DT5PKqZWQlTTp/P2A8XycBWxOdr5vobCm2a5W\nQtve6nP7AgMBAAECggEADJXiQg6S5KCbVGCUNnMKrfDuSysQo4DzddhEcl4jGysE\nSKGj5cBO6EaTxtCEmr5MpnEAD1duPcF1A5uaoBiWDiTvC/nBKMWlsiLnZnIidQ2x\n2q5zX5Gd8DoTdvzVvw5w+DUiXjorc8wMREGRfDpKUf0DBgf9/mgy0oQyo/0op0dH\nHVuGcnVcmbeYRDYYxnTEQZ1A9nPQo5sOJn+lpjxBNy8o3Ai59dOpGS6/igGH8EUC\n+52hR2uJuyw0/uRdiZ7iirgKfEJqzeewlkiD/4oDnfjUfMHtxuAXqRtpWUzPhVY1\nK4fJqoMKo9Mg5FmD+rHbx7fT+VQn2nE7M5dFI8qIEQKBgQDOMMQ5CkOS9Sprw2S1\nU5k7fVYcZ/t5ZmBV+g676Nja3nAp+CjBO3EBW9xDSmp1rJEQgs1Rna2oz5ZqnbCn\n3brjK1EwOuK+ZvdeREBx4rVIvth/dCtL0YGysM4/kMOksspyT3FiqcN2slLgV4mN\ntIaqgVHy6Q3P/3etff+pzf870QKBgQC/UyHCk7Q05zr4fhMYrFuNj2B0ineF435B\nNoTf6XpWk1ZQ5phUQ3Yg5+tYaFwqxM2w1MMDtNTPySPqUMm0hGSMoasVtfNp5wY9\nOG7GluqClHGKebOkGWUSK5xvQ3U586B89xKMeCi2EbM2/W61hj6Sqb7pdWax+Ap4\nkSrXC9dCCwKBgQCov3iYRjIvn75sG6ncTOLnsRg8f01secD2HITafSKdXdbmQlb4\nbjF6LzgBSnH+hJDktmhbF3T854fvEcd2Wx2MtfLoSgkwUwy4dZtYmXZMZwTAqs6U\nao5/M/xYQZ4cuMa+7w2Y9d8m0aLKQFovQ0PDX7s11k6boDTOJISM8C6nQQKBgQCf\nKlCmp+w+KrOTcIcAerr7jHDI4zzF5Nju9aUbBghhp9ciHIRTbYADpgzTEpbCedFI\nr+fA2JpGdmXrk+QJyi5AFGrY9/KVgr1dBuqZSYm0sju24MJC3WGI+UD+Cxel63jz\nHTSQKZJszVLTh4ineRPrPU32uFWD7v7/CH2kQ1SDuwKBgEtVUBwpTGCKNkJz40cx\nJGKDlzmJVe01B7j95xDJQXz4kGXlMrF12LW0C1L/KuaVvQz1dzZSXVmzB8MSrd6A\n4TnKi7JPCBtYjgK6tlfvATFVhBwrITmeb7MinuX8Q3gse6FODhiRko3MyI332O3c\nLVgOKl4sF4oalkOfXB29GjHx\n-----END PRIVATE KEY-----\n",
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
        parents:["1ORxsqlEAu_R7cMTthvPV8QPgtRtddNX6"],
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
