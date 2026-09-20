// import "bootswatch/dist/sketchy/bootstrap.min.css"
import './bootstrap.css'
import "bootstrap-icons/font/bootstrap-icons.css";
// Loaded after the vendor theme so the RootMath design system wins.
import './globals.css'


import StoreProvider from "@/lib/redux/StoreProvider";
import 'katex/dist/katex.min.css';
import { ClerkProvider } from '@clerk/nextjs'




export const metadata = {
  title: "Root Math",
  description: "Say hello to the end of hefty tuition fees",
};

/*
Note that this folder simply holds the global providers of the apps. 
*/

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
   <ClerkProvider>
    <html lang="en">
      
      <body >
        <StoreProvider>
        {children}
        </StoreProvider>
        </body>
    </html>
    </ClerkProvider>
  );
}
