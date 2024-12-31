import LearnNav from "@/lib/components/learn/LearnNav"


export default function LearnLayout({ children }) {
  return (
    <>
    <div className='learn-container'>
    <br />
    <br />
      
    <div className="learnBar-container">
      <LearnNav />
    </div>

    <div className='breadcrumb-nav'>
      {/* <Breadcrumbs /> */}
    </div>
   

    <div className="learn-outlet" >
    <main>{children}</main>
    </div>

    </div>
     

    
    </>
  )
}
