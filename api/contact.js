export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido.' });
  }

  try {
    const { name, email, phone = '', topic, message, website = '' } = req.body || {};

    // Honeypot básico para bots.
    if (website) {
      return res.status(200).json({ ok: true });
    }

    if (!name || !email || !topic || !message) {
      return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ error: 'El email no parece válido.' });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const CONTACT_TO = process.env.CONTACT_TO || 'hola@xxxxx.com';
    const FROM_EMAIL = process.env.FROM_EMAIL || 'Solar Reiki <onboarding@resend.dev>';

    if (!RESEND_API_KEY) {
      return res.status(500).json({ error: 'El servidor todavía no tiene configurado el servicio de correo.' });
    }

    const safe = value => String(value).replace(/[<>]/g, '');
    const subject = `Nuevo contacto Solar Reiki · ${safe(topic)}`;

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;line-height:1.6;color:#22312b">
        <h2 style="margin-bottom:24px">Nuevo contacto desde Solar Reiki</h2>
        <p><strong>Nombre:</strong> ${safe(name)}</p>
        <p><strong>Email:</strong> ${safe(email)}</p>
        <p><strong>WhatsApp:</strong> ${safe(phone || 'No indicado')}</p>
        <p><strong>Motivo:</strong> ${safe(topic)}</p>
        <hr style="border:0;border-top:1px solid #ddd;margin:24px 0">
        <p><strong>Mensaje</strong></p>
        <p style="white-space:pre-wrap">${safe(message)}</p>
      </div>
    `;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [CONTACT_TO],
        reply_to: email,
        subject,
        html
      })
    });

    const resendData = await resendResponse.json().catch(() => ({}));

    if (!resendResponse.ok) {
      console.error('Resend error:', resendData);
      return res.status(502).json({ error: 'No fue posible entregar el mensaje. Inténtalo de nuevo o utiliza WhatsApp.' });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno. Inténtalo de nuevo más tarde.' });
  }
}
