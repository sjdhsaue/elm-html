<template>
  <div>
    <ul>
      <li v-for="item in processedData" :key="item">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import axios from 'axios'

export default {
  setup() {
    const data = ref([])
    const processedData = computed(() => {
      return data.value.map(item => {
        return `${item.foodName} ${item.foodPrice}  ${item.foodId}`
      })
    })

    async function fetchData() {
      const response = await axios.get('http://localhost:8081/food/listall')
      data.value = response.data.content
    }

    fetchData()

    return {
      data,
      processedData
    }
  }
}
</script>