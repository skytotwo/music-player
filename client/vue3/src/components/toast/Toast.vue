<script setup lang="ts">
defineProps<{
  text: string
  show: boolean
}>()
</script>

<template>
  <transition name="mt-toast">
    <div
      v-show="show"
      class="mt-toast"
    >
      <div class="mt-toast__text">
        {{ text }}
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
@include b(mt-toast) {
  position: fixed;
  z-index: 11000;
  top: 50%;
  left: 50%;
  min-width: 5.5rem;
  padding: 0.2rem 1.1rem;
  background: rgb(0 0 0 / 60%);
  border-radius: 0.25rem;
  color: white;
  opacity: 1;
  text-align: center;
  transform: translate3d(-50%, -50%, 0) scale(1.2);
  transition: transform 0.3s, opacity 0.3s;

  &.mt-toast-enter {
    opacity: 0;
    transform: translate3d(-50%, -50%, 0) scale(0.8);
  }

  &.mt-toast-leave-active {
    opacity: 0;
    transform: translate3d(-50%, -50%, 0) scale(1.2);
  }

  @include e(text) {
    margin: 0.2rem 0;
    font-size: 0.8rem;
  }
}
</style>
