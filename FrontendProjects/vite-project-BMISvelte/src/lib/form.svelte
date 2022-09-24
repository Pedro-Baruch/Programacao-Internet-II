<script lang="ts">
    let name : string
    let weight : string
    let height : string

    export const handleSubmit = () => {
        const BMI = Math.floor(Number(weight) / (Number(height) * Number(height)))

        alert(`Seu BMI ${name} é de ${BMI}`)
    }
</script>

<form on:submit={handleSubmit}>
    <div class="input-control">
        <label for="">Name: </label>
        <input type="text" bind:value={name}/>
    </div>
    <div class="input-control">
        <label for="">Weight: </label>
        <input type="number" bind:value={weight}/>
    </div>
    <div class="input-control">
        <label for="">Height: </label>
        <input type="number" bind:value={height}/>
    </div>
    <button id="btn_calculate">Calculate</button>
</form>