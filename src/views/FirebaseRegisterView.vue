<template>
  <div class="container mt-5" style="max-width: 500px;">
    <h1 class="text-center mb-4">Create an Account</h1>
    <form @submit.prevent="register">
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input type="email" class="form-control" placeholder="Email" v-model="email" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Password</label>
        <input type="password" class="form-control" placeholder="Password" v-model="password" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Select Role (Task 7.2)</label>
        <select class="form-select" v-model="role">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary w-100">Save to Firebase</button>
    </form>
    <div v-if="successMsg" class="alert alert-success mt-3">{{ successMsg }}</div>
    <div v-if="errorMsg" class="alert alert-danger mt-3">{{ errorMsg }}</div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "vue-router";
import { auth, db } from "../firebase/init";

const email = ref("");
const password = ref("");
const role = ref("user");
const errorMsg = ref("");
const successMsg = ref("");
const router = useRouter();

const register = async () => {
  errorMsg.value = "";
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    console.log("Firebase Register Successful!", userCredential.user);

    // Store user role in Firestore to support role-based login
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: email.value,
      role: role.value
    });

    successMsg.value = "Registration successful! Redirecting to login...";
    setTimeout(() => {
      router.push("/FireLogin");
    }, 1500);
  } catch (error) {
    console.error("Registration error:", error.code);
    errorMsg.value = error.message;
  }
};
</script>
