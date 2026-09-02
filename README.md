# Solar Reiki V3

Tercera propuesta de Solar Reiki, construida con HTML5, CSS3, Bootstrap 5, JavaScript vanilla y una función serverless de Vercel para el formulario.

## Stack

- HTML5 semántico
- CSS3 custom
- Bootstrap 5.3.3 (CDN)
- JavaScript vanilla
- Animaciones con IntersectionObserver + CSS
- Vercel Serverless Function
- Resend para envío de email

## Desarrollo local

Puedes abrir `index.html` directamente o usar un servidor local.

```bash
npm install
npm run dev
```

El comando usa `npx serve` para servir el directorio.

## Configuración del formulario

El endpoint es `api/contact.js`.

En Vercel configura estas variables de entorno:

```text
RESEND_API_KEY=re_xxxxxxxxx
CONTACT_TO=hola@xxxxx.com
FROM_EMAIL=Solar Reiki <onboarding@resend.dev>
```

En producción conviene usar un remitente de tu propio dominio, una vez verificado en Resend.

## WhatsApp

El número provisional está definido en:

`assets/js/main.js`

Busca:

```js
whatsappNumber: '50600000000'
```

y sustitúyelo por el número real sin espacios ni símbolos.

## Contenido que falta sustituir antes de publicar

1. Fotografía real de Svetlana.
2. Testimonios reales y autorizados.
3. Número de WhatsApp.
4. Correo real de recepción.
5. Textos legales revisados.
6. Dominio propio y configuración SEO final.

## Deploy en GitHub + Vercel

```bash
git init
git add .
git commit -m "Create Solar Reiki V3"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git push -u origin main
```

Después conecta el repositorio desde Vercel. No hace falta configurar un build command para esta versión.
