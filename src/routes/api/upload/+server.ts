import { json } from '@sveltejs/kit';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST({ request }) {

  try {
    // 1. Parse the FormData from the request
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 2. Prepare the file path
    // process.cwd() gets the root of the project
    const uploadDir = path.join(process.cwd(), 'data', 'new');

    // Ensure the directory exists
    await mkdir(uploadDir, { recursive: true });

    // 3. Convert the file to a Buffer
    // SvelteKit/Web Standard 'File' needs to be converted for Node's filesystem
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Write the file
    // WARNING: In production, sanitize 'file.name' to prevent overriding files or path traversal
    const filePath = path.join(uploadDir, file.name);
    await writeFile(filePath, buffer);

    return json({ success: true, filename: file.name });

  } catch (err) {
    console.error(err);
    return json({ error: 'Upload failed' }, { status: 500 });
  }
}