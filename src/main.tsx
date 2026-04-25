/**
 * main.tsx
 * --------
 * App entry point. Mounts the <App /> component on the #root <div> in
 * index.html and pulls in global styles.
 *
 * Vite picks this file up from the <script type="module"> in index.html.
 * No routing or business logic here — that all lives inside <App />.
 */

import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(<App />);
