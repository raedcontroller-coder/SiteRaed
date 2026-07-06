import "./globals.css";

export const metadata = {
  title: "Raed | Future Intelligence",
  description: "Software e IA Orientados a Resultado",
  icons: {
    icon: '/assets/img/Logo.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        <script src="https://unpkg.com/@phosphor-icons/web" async></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
