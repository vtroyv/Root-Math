import "bootswatch/dist/sketchy/bootstrap.min.css"
import StoreProvider from "@/lib/redux/StoreProvider";
import 'katex/dist/katex.min.css';


export const metadata = {
  title: "Self Marking Prototype",
  description: "Prototype of the self marking section of Root Math",
};

export default function RootLayout({ children }) {
  return (
   
    <html lang="en">
      <body >
        <StoreProvider>
        {children}
        </StoreProvider>
        </body>
    </html>
    
  );
}
