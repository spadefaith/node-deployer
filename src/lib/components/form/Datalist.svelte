<script lang="ts">
  type DatalistOptionType = {
    value: string;
  };
  type PropsType = {
    placeholder: string;
    name: string;
    leftIcon?: string;
    font?: 'roboto-regular font-14';
    label?: string;
    display?: string;
    options: DatalistOptionType[];
  };

  export let props = {} as any;
</script>

<div class="field">
  {#if props.label}
    <label class="label" for={props.name}>
      {props.label}
    </label>
  {/if}

  <p class="control has-icons-left has-icons-right">
    <input
      class={`input ${props.font ? props.font : ''}`}
      type="text"
      placeholder={props.placeholder}
      id={props.name}
      name={props.name}
      list={`${props.name}s`}
    />

    {#if props.leftIcon}
      <span class="icon is-small is-left">
        <i class={`fas  ${props.leftIcon}`}></i>
      </span>
    {/if}
  </p>

  <datalist id={props.name}>
    {#each props.options as option}
      <option value={option.value} />
    {/each}
  </datalist>
</div>
