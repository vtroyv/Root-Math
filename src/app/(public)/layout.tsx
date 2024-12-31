// In this folder put the layout for public/home pages 
import Navigation from "@/lib/components/home/Navigation"

export default function PublicLayout({
    children,
  }: {
    children: React.ReactNode
  }) {

    return(
        <>        
        <div>
            <Navigation />
        </div>
        
        <div className="outlet-container">
            {children}

        </div>
        </>

    )

  }