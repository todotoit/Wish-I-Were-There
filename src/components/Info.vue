<template>
  <div class="info">
    <section class="project">
      <p class="title">THE PROJECT</p>
      <p class="description">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit luctus viverra erat aliquet placerat. Elementum adipiscing quis cras quam lacus ornare. Porttitor sagittis velit turpis dolor. Elementum sed et duis congue ullamcorper fringilla.
        Suscipit sit in egestas tellus pharetra metus, purus leo. Vitae mattis mauris, interdum tincidunt quis aliquam enim, tempus. Aenean aenean tincidunt in mauris natoque. Consequat convallis bibendum consequat pellentesque nibh cras ornare adipiscing. Nec dis auctor vulputate amet blandit sapien tempor interdum. Sapien, cursus mauris nibh facilisis a, tristique ut.
        Suscipit tempor, quisque porttitor sit blandit porttitor vel fusce ullamcorper. Non in auctor mattis dolor pellentesque pulvinar pretium malesuada. Consectetur dolor quis tincidunt integer egestas tellus. Semper tristique porttitor natoque scelerisque.
      </p>
    </section>
    <section class="team">
      <p class="title">THE TEAM</p>
      <ul class="people">
        <li>Person 01</li>
        <li>Person 02</li>
        <li>Person 03</li>
        <li>Person 04</li>
      </ul>
    </section>
    <section class="copy">
      <p class="title">A PROJECT BY</p>
      <img src="@/assets/icons/todo-logo.svg" />
    </section>
  </div>
</template>

<script>
export default {
  name: "Info"
};
</script>

<style lang="scss" scoped>
.info {
  position: absolute;
  padding: 0 0.5rem;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 100;
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  section {
    padding-top: 0.5rem;
    width: 60%;
    .title {
      font-weight: bold;
    }
    p {
      margin: 0;
      padding: 0;
      font-size: 1.5rem;
      line-height: 120%;
    }
    ul {
      list-style-type: none;
      padding: 0;
      margin: 0;
      li {
        font-size: 1.5rem;
        line-height: 120%;
      }
    }
  }
}
</style>
