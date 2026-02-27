import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        const validUsername = process.env.ADMIN_USERNAME || 'patticakeslime';
        const validPassword = process.env.ADMIN_PASSWORD || 'patticakeslime';

        if (username === validUsername && password === validPassword) {
            return NextResponse.json({ success: true });
        }

        return NextResponse.json(
            { success: false, error: 'Invalid credentials' },
            { status: 401 }
        );
    } catch {
        return NextResponse.json(
            { success: false, error: 'Bad request' },
            { status: 400 }
        );
    }
}
