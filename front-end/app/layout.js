import SessionWrapper from "./Components/essentials/SessionWrapper";
import { NavBar } from "./Components/layout/NavBar";
import "./globals.css";

export const metadata = {
  title: "Dev Collab"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>
          <NavBar />
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
