<script lang="ts">
  export let props = {} as any;
</script>

<div class="field">
  <div class="control">
    <label class="checkbox">
      <input type="checkbox" name={props.name} id={props.name} /> &nbsp;
      {props.display}
    </label>
  </div>
</div>
