// LearnLayout.js
import LearnNav from "@/lib/components/learn/LearnNav"
import Breadcrumbs from "@/lib/components/learn/Breadcrumbs"
import ChatWidget from "@/lib/components/learn/MyTutor"
import StudyTimer from "@/lib/components/learn/StudyTimer"
import "bootstrap-icons/font/bootstrap-icons.css";


export default function LearnLayout({ children }) {
  return (
    <>
      {/* The nav is a direct child (no wrapper div) so its `position: sticky` works, as in the (public) layout.
          It takes up its own space, so the page needs no spacers under it. */}
      <LearnNav />

      {/* A full-width strip under the nav; renders nothing on /learn itself */}
      <Breadcrumbs />

      <div className="learn-outlet">
        <main>{children}</main>
      </div>

      {/* Place your chat widget here so it appears on every page */}
      <ChatWidget />

      {/* counts active minutes for the study-time goal on the Questions page; renders nothing */}
      <StudyTimer />
    </>
  )
}
