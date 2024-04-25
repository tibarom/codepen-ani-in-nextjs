import pug from 'pug';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function GET( req: NextRequest, res: NextResponse) {
  const filePath = path.join(process.cwd(), 'public/render.pug');
  const html = pug.renderFile(filePath);
  
  return NextResponse.json({
    statusCode: 200,
    message: '200 OK',
    htmlContent: html
  });
}
