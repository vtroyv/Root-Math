// In this folder put the layout for public/home pages 
import Navigation from "@/lib/components/home/Navigation"

export default function PublicLayout({
    children,
  }: {
    children: React.ReactNode
  }) {

    return(
        <>
        {/* Rendered as a direct child so `position: sticky` on the nav is
            scoped to the page rather than to a wrapper div. */}
        <Navigation />

        <div className="outlet-container">
            {children}

        </div>
        </>

    )

  }