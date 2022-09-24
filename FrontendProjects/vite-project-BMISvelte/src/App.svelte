<script lang="ts">
  import Input from "./lib/input.svelte";
  import Form from "./lib/form.svelte";
  import CalculateButton from "./lib/calculate_button.svelte";

  let name : string
  let weight : string
  let height : string
</script>

<main>
  <div id='container'>
    <header>
      <h1>BMI Calculator</h1>
    </header>
    <main>
      <h2>Type your data</h2>
      <Form>
        <Input label={"Name: "} input={name} />
        <Input label={"Weight: "} input={weight} />
        <Input label={"Height: "} input={height} />
        <CalculateButton/>
      </Form>
    </main>
    <footer>
      <p>R1 Software @ 2023</p>
    </footer>
  </div>
</main>

<style>

</style>