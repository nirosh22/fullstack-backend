<template>
  <div>
    <h1>Available Lessons</h1>

    <div v-if="loading">Loading lessons...</div>
    <div v-else-if="lessons.length === 0">No lessons found.</div>

    <ul v-else>
      <li v-for="lesson in lessons" :key="lesson._id">
        {{ lesson.subject }} — {{ lesson.location }} — ${{ lesson.price }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      lessons: [],
      loading: true,
    };
  },
  async created() {
    try {
      const res = await fetch("http://localhost:3000/lessons");
      this.lessons = await res.json();
    } catch (err) {
      console.error("Error fetching lessons:", err);
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 20px;
}
</style>

