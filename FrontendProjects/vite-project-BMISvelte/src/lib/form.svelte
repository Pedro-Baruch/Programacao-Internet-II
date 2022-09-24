<script lang="ts">
    import Input from "./input.svelte"
    
    let name : string
    let weight : string
    let height : string

    export const handleSubmit = () => {
        const BMI = Math.floor(Number(weight) / (Number(height) * Number(height)))

        alert(`Seu BMI ${name} é de ${BMI}`)
    }
</script>

<form on:submit={handleSubmit}>
    <Input label={"Name"} bind:input={name}/>
    <Input label={"Weight"} bind:input={weight}/>
    <Input label={"Height"} bind:input={height}/>
    <button id="btn_calculate">Calculate</button>
</form>