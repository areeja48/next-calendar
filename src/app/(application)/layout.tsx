
import SideBar from '@/components/SideBar'
import Header  from '@/components/Header'


export default function ApplicationLayout({ children }: { children: React.ReactNode }) {
  return (
    
     <div> <Header />
     <SideBar  />

     <div className="pt-16 h-full"> {/* Add padding-top for the fixed header height */}
       {children}
     </div>
  </div>
   
     
      
  )
}
