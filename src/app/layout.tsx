// import "bootswatch/dist/sketchy/bootstrap.min.css"
import './bootstrap.css'
import "bootstrap-icons/font/bootstrap-icons.css";


import StoreProvider from "@/lib/redux/StoreProvider";
import 'katex/dist/katex.min.css';
import Navigation from "@/lib/components/home/Navigation";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'




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
