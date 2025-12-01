const Header = (props) => <h1>{props.name}</h1>

const Content = (props) => (
  <div>
    {props.parts.map(part => <Part part={part} key={part.id} />)}
  </div>
)

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = (props) => {
  const total = props.parts.reduce(
    (accumulator, currentValue) => accumulator + currentValue.exercises,
    0
  )
  return (
  <p>
    <b>
      total of {total} exercises
    </b>
  </p>
)}

const Course = ({ course }) => {
  return (
    <>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  )
}

export default Course