export const Teams = () => {
    
    const teams = ['Brazil', 'Germany','France', 'USA', 'Canadá']
    
    return(
        <>
            <h1>Teams</h1>
            <ul>
                {teams.map(teams => <li>{teams}</li>)}
            </ul>
        </>
    )
}