<script lang="ts">
  export let props: { col?: number; classes?: string } = {} as any;
</script>

<div class={`form-control-item form-col-${props.col || 1} ${props.classes}`}>
  <slot />
</div>
