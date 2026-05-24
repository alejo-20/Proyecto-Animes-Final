const supabaseAdmin = require('../supabaseAdmin');

function detectMimeFromBuffer(buffer) {
  const magic = buffer.subarray(0, 12).toString('hex');
  if (magic.startsWith('89504e47')) return 'image/png';
  if (magic.startsWith('ffd8ffe0') || magic.startsWith('ffd8ffe1') || magic.startsWith('ffd8ffe2')) return 'image/jpeg';
  if (magic.startsWith('474946')) return 'image/gif';
  if (magic.startsWith('52494646')) return 'image/webp';
  return null;
}

async function uploadBase64(base64String, folder) {
  let raw = base64String;
  let contentType = 'image/png';

  if (base64String.startsWith('data:')) {
    const matches = base64String.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) throw new Error('Formato base64 inválido');
    contentType = `image/${matches[1]}`;
    raw = matches[2];
  }

  const buffer = Buffer.from(raw, 'base64');
  const detected = detectMimeFromBuffer(buffer);
  if (detected) contentType = detected;
  const ext = contentType.split('/')[1] || 'png';
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from('imagenes')
    .upload(fileName, buffer, {
      contentType,
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('imagenes')
    .getPublicUrl(fileName);

  return publicUrl;
}

module.exports = { uploadBase64 };
