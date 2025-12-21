import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ message: 'No file provided' }, { status: 400 });
        }

        const apiKey = process.env.IMGBB_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ message: 'Server configuration error: Missing ImgBB API Key' }, { status: 500 });
        }

        const imgbbFormData = new FormData();
        imgbbFormData.append('image', file);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: imgbbFormData,
        });

        const data = await response.json();

        if (!data.success) {
             throw new Error(data.error?.message || 'ImgBB upload failed');
        }

        return NextResponse.json({ url: data.data.url }, { status: 200 });

    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({ message: error.message || 'Upload failed' }, { status: 500 });
    }
}