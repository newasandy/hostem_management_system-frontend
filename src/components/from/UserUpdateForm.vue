<template>
  <form>
    <div class="grid grid-cols-2 gap-4 p-4 shadow-md rounded-lg">
      <div>
        <div>
          <div class="mb-1">
            <label
              for="fullName"
              class="block text-base font-medium text-gray-700 font-medium"
            >
              Full Name:
            </label>
          </div>
          <div class="mb-3">
            <input
              id="fullName"
              type="text"
              class="w-full p-3 h-9 border rounded-lg"
              placeholder="Enter Full Name"
            />
            <!-- <span v-if="errors.fullName" class="text-red-500 text-sm">{{
              errors.fullName
            }}</span> -->
          </div>
        </div>
        <div>
          <div class="mb-1">
            <label
              for="email"
              class="block text-base font-medium text-gray-700 font-medium"
            >
              Email:
            </label>
          </div>
          <div class="mb-3">
            <input
              id="email"
              type="text"
              class="w-full p-3 h-9 border rounded-lg"
              placeholder="Enter email"
            />
            <!-- <span v-if="errors.fullName" class="text-red-500 text-sm">{{
              errors.fullName
            }}</span> -->
          </div>
        </div>
      </div>
      <div>
        <div>
          <div class="mb-1">
            <label
              for="country"
              class="block text-base font-medium text-gray-700 font-medium"
            >
              Country:
            </label>
          </div>
          <div class="mb-3">
            <input
              id="country"
              type="text"
              class="w-full p-3 h-9 border rounded-lg"
              placeholder="Enter Full Name"
            />
            <!-- <span v-if="errors.fullName" class="text-red-500 text-sm">{{
              errors.fullName
            }}</span> -->
          </div>
        </div>
        <div>
          <div class="mb-1">
            <label
              for="district"
              class="block text-base font-medium text-gray-700 font-medium"
            >
              District:
            </label>
          </div>
          <div class="mb-3">
            <input
              id="district"
              type="text"
              class="w-full p-3 h-9 border rounded-lg"
              placeholder="Enter Full Name"
            />
            <!-- <span v-if="errors.fullName" class="text-red-500 text-sm">{{
              errors.fullName
            }}</span> -->
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
