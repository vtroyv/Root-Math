import LearnCourses from "@/lib/components/learn/LearnCourses";
export default function LearnDashboard() {
    /*
    NOTE ALTHOUGH THE INFORMATION DISPLAYED IN THE LearnCourses component is dynamic, we'll need to ensure that the links are aswell., e.g. 
    having an array or object that generates the correct links conditionally dependent on the students examboard
    */
    return (
        <div>
            <LearnCourses />
        </div>
    );
}