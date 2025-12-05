
const Persons = (props) => {
    return (
        <div>
            {props.personsToShow.map(person =>
                <p key={person.id}>
                    {person.name} {person.number}
                    <button onClick={() => props.handleDelete(person.id)}>Delete</button>
                </p>
            )}
        </div>
    )
}

export default Persons