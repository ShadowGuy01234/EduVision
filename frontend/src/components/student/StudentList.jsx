import StudentTile from './StudentTile';

const StudentList = ({ students }) => {
  return (
    <div className="space-y-4">
      {students.map((student) => (
        <StudentTile key={student.id} student={student} />
      ))}
    </div>
  );
};

export default StudentList; 