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
    <slot/>
</form>