<script lang="ts">
    export let input : string
    export let label : string
</script>

<div class="input-control">
    <label for={label}>{label}</label>
    <input type="text" bind:value={input}/>
</div>