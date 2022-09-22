export function BMIForm(){
    return(
        <form action="#">
          <div className="input-control">
            <label htmlFor="name">Name: </label>
            <input autoComplete="off" type="text" id="name" />
          </div>
          <div className="input-control">
            <label htmlFor="weight">Weight: </label>
            <input autoComplete="off" type="number" id="weight" />
          </div>
          <div className="input-control">
            <label htmlFor="height">Height: </label>
            <input autoComplete="off" type="number" step="0.01" id="height" />
          </div>
        </form>
    )
}