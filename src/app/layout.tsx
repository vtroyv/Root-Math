// import "bootswatch/dist/sketchy/bootstrap.min.css"
import './bootstrap.css'
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
  title: "Self Marking Prototype",
  description: "Prototype of the self marking section of Root Math",
};

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
          <div> 
            <Navigation />

          </div>
          <div className='outlet-container'>
        {children}
        </div>

        </StoreProvider>
        </body>
      
    </html>
    </ClerkProvider>
  );
}
