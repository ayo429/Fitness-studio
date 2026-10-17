# Stride Fitness

A responsive landing page for a fictional gym, built with React and Tailwind CSS. It presents training programs, membership plans and a free-week sign-up, and was converted from a static HTML/CSS site as a practicum project.

## Features

- Responsive layout with a hamburger menu on medium and small screens
- Sections for programs, how it works, membership plans and sign-up
- Content-driven components: programs, steps and plans render from data arrays
- Design tokens (colors, fonts) defined once in a Tailwind `@theme` block
- Reduced-motion support and keyboard-accessible navigation

## Tech Stack

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/vite`
- Google Fonts: Montserrat and Inter

## Getting Started

**Prerequisites:** Node.js 20.19 or later and npm.

```bash
git clone https://github.com/ayo429/Fitness-studio
cd stride-fitness
npm install
npm run dev
```

Open the local URL printed in the terminal (usually `http://localhost:5173`).

## Scripts

| Command           | Description                       |
| ----------------- | --------------------------------- |
| `npm run dev`     | Start the development server      |
| `npm run build`   | Create a production build in `dist` |
| `npm run preview` | Preview the production build      |
| `npm run lint`    | Run ESLint                        |

## Project Structure

```
public/
  favicon.svg
  images/              # fitness_img, goal_img, plan_img, train_img (.jpg)
src/
  components/
    Navbar.jsx
    Hero.jsx
    Programs.jsx
    HowItWorks.jsx
    Plans.jsx
    Join.jsx
    Footer.jsx
  App.jsx
  index.css            # Tailwind import, theme tokens, shared button styles
  main.jsx
```

## Customization

- **Colors and fonts:** edit the `@theme` block in `src/index.css`.
- **Content:** edit the data arrays at the top of `Programs.jsx`, `HowItWorks.jsx` and `Plans.jsx`.
- **Images:** replace the files in `public/images/`, keeping the same names or updating the paths in the components.

## Roadmap

- Connect the sign-up and newsletter forms to an email service (both currently only prevent the default submit)
- Add real Privacy Policy and Terms of Use pages

## License

Educational project.