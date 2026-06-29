# Premium 3D Birthday Surprise Website for Isha Ishrat — Lightweight Version

This is the optimized static birthday surprise website for **Isha Ishrat**. It uses only HTML5, CSS3, JavaScript, Three.js, GSAP, Canvas, and WebGL. There is no backend, database, build step, React, Vue, or Angular.

This version has **Reduce Effects enabled by default** and removes the visible music controls, music file, action buttons, and the two informational cards titled “Cinematic 3D moment” and “Fireworks unlocked.” It is designed to feel premium while loading faster and responding more smoothly.

## What is included

- Live countdown to **30 June 2026, 12:00:01 AM Pakistan Standard Time**
- Lightweight 3D galaxy background with stars, soft nebula, aurora, and smooth camera movement
- Reduced visual effects mode enabled by default
- Rotating 3D birthday cake with candles after the countdown unlocks
- Animated 3D gift box and CSS gift-box final surprise
- Cinematic reveal after countdown reaches zero
- Typewriter birthday letter for Isha Ishrat
- Glassmorphism luxury dark UI with pink, purple, gold, and blue accents
- Fully responsive layout for mobile, tablet, and desktop

## Folder structure

```text
isha_birthday_surprise_light/
├── index.html
├── style.css
├── script.js
├── README.md
├── effects/
│   └── canvas-effects.js
├── assets/
│   └── icons/
│       └── favicon.svg

## Memory gallery

The memory gallery has been removed in this version to keep the website lighter and cleaner.

## Music note

Music has been removed completely in this version for smoother loading and fewer browser autoplay issues. There are no music controls and no music file required.

## How to edit the birthday message

1. Open `script.js`.
2. Find the `birthdayLetter` section near the top of the file.
3. Replace the message inside the backticks.

Look for this section:

```js
birthdayLetter: `Dear Isha Ishrat,
...
Your best friend`,
```

Keep the backticks at the beginning and end of the message.

## How to change the countdown date

The countdown is configured in `script.js`:

```js
targetUtcTimestamp: Date.UTC(2026, 5, 29, 19, 0, 1, 0),
```

This represents **30 June 2026, 12:00:01 AM Pakistan Standard Time** because Pakistan is UTC+5.

JavaScript months are zero-indexed:

- January = 0
- February = 1
- March = 2
- April = 3
- May = 4
- June = 5
- July = 6
- August = 7
- September = 8
- October = 9
- November = 10
- December = 11

For Pakistan time, convert your desired local time to UTC by subtracting 5 hours.

Example: 1 July 2026, 12:00:01 AM Pakistan time becomes 30 June 2026, 7:00:01 PM UTC:

```js
targetUtcTimestamp: Date.UTC(2026, 5, 30, 19, 0, 1, 0),
```

## How to change the recipient name

Open `script.js` and update:

```js
recipientName: 'Isha Ishrat',
```

Also update visible text in `index.html` if you want the displayed heading to use another name.

## How to upload to hosting

### Netlify

1. Go to Netlify.
2. Choose **Add new site**.
3. Drag and drop the full `isha_birthday_surprise_light` folder.
4. Netlify will publish the website.

### Vercel

1. Create a new Vercel project.
2. Upload or import the folder.
3. No build command is required.
4. The output directory is the root folder.

### GitHub Pages

1. Create a GitHub repository.
2. Upload all files and folders.
3. Go to repository **Settings → Pages**.
4. Select the branch and root folder.
5. Save and open the published URL.

### Hostinger / cPanel / Any static hosting

1. Open File Manager.
2. Go to `public_html` or the website root folder.
3. Upload all files and folders from `isha_birthday_surprise_light`.
4. Make sure `index.html` stays in the root directory.
5. Visit your domain.

## CDN dependency note

The website loads Three.js and GSAP from CDN links in `index.html`. This keeps the project simple and static. If you want the site to run fully offline, download the Three.js and GSAP files and update the script paths in `index.html`.

## Editing tips

- Main design: `style.css`
- Main experience logic: `script.js`
- Reduced canvas effects: `effects/canvas-effects.js`
- Visible page structure: `index.html`

## Final check before publishing

- Open `index.html` in Chrome and test the countdown.
- Upload the entire folder to your hosting service.

Enjoy the surprise.
