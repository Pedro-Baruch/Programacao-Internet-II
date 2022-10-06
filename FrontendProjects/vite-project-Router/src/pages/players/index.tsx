export const Player = () => {
    
    const players = ['Vini Jr', 'Neymar','CR7', 'Messi', 'Mbapé']
    
    return(
        <>
            <h1>Teams</h1>
            <ul>
                {players.map(players => <li>{players}</li>)}
            </ul>
        </>
    )
}