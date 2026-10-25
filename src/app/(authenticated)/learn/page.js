import LearnCourses from "@/lib/components/learn/LearnCourses";
export default function LearnDashboard() {
    /*
    The courses, their links and their progress come from GET /api/courses, which reads the course list in
    src/lib/courses/courses.js. Add other exam boards' courses there as they're built.
    */
    return (
        <div>
            <LearnCourses />
        </div>
    );
}