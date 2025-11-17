<template>
  <div class="min-h-screen bg-slate-100 flex items-center justify-center px-4">
    <div class="w-full max-w-lg bg-white shadow-lg rounded-xl p-6">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- First Name -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1"> First Name </label>
          <input
            v-model="form.firstName"
            type="text"
            required
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="John"
          />
        </div>

        <!-- Last Name -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1"> Last Name </label>
          <input
            v-model="form.lastName"
            type="text"
            required
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Doe"
          />
        </div>

        <!-- City + Country in a row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1"> City </label>
            <input
              v-model="form.city"
              type="text"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Austin"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1"> Country </label>
            <input
              v-model="form.country"
              type="text"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="USA"
            />
          </div>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1"> Email </label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="you@example.com"
          />
        </div>

        <!-- Submit button -->
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 text-white text-sm font-medium px-4 py-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-blue-700 transition"
        >
          <span v-if="!isSubmitting">Submit</span>
          <span v-else>Submitting...</span>
        </button>
      </form>

      <!-- Message -->
      <div v-if="message" class="mt-4">
        <div
          class="text-sm px-3 py-2 rounded-lg"
          :class="
            messageType === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          "
        >
          {{ message }}
        </div>
      </div>

      <!-- Debug box: show Vue state -->
      <div class="mt-6">
        <h2 class="text-sm font-semibold text-slate-700 mb-2">Current form data (Vue state)</h2>
        <pre class="text-xs bg-slate-900 text-slate-100 rounded-lg p-3 overflow-x-auto"
          >{{ form }}
        </pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 1) Reactive state for the form
const form = ref({
  firstName: '',
  lastName: '',
  city: '',
  country: '',
  email: '',
})

const isSubmitting = ref(false)
const message = ref('')
const messageType = ref('success') // 'success' | 'error'

// 2) Submit handler
const handleSubmit = async () => {
  isSubmitting.value = true
  message.value = ''
  messageType.value = 'success'

  try {
    // Call backend (we'll create it next)
    const res = await fetch('http://localhost:3000/api/form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    })

    if (!res.ok) {
      throw new Error('Server error')
    }

    const data = await res.json()
    console.log('Server response:', data)

    messageType.value = 'success'
    message.value = data.message || 'Form submitted successfully!'

    // Optional: reset form
    form.value = {
      firstName: '',
      lastName: '',
      city: '',
      country: '',
      email: '',
    }
  } catch (err) {
    console.error(err)
    messageType.value = 'error'
    message.value = 'Error sending data to the server.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
