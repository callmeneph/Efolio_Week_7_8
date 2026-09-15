<template>
  <div class="container mt-5" style="max-width: 500px;">
    <h1 class="text-center mb-4">Firebase Sign in</h1>

    <div v-if="!currentUser">
      <form @submit.prevent="signin">
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" placeholder="Email" v-model="email" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Password</label>
          <input type="password" class="form-control" placeholder="Password" v-model="password" required />
        </div>
        <button type="submit" class="btn btn-primary w-100">Sign in via Firebase</button>
      </form>
    </div>

    <!-- Logout / Current User Display -->
    <div v-else class="text-center">
      <div class="alert alert-info">
        <p class="mb-1"><strong>Logged in as:</strong> {{ currentUser.email }}</p>
        <p class="mb-0"><strong>Role:</strong> {{ currentRole }}</p>
      </div>
      <button class="btn btn-danger w-100" @click="logoutUser">Log out</button>
    </div>

    <div v-if="errorMsg" class="alert alert-danger mt-3">{{ errorMsg }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/init";

const email = ref("");
const password = ref("");
const errorMsg = ref("");
const currentUser = ref(null);
const currentRole = ref("");

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUser.value = user;
      console.log("Current signed in user:", auth.currentUser);

      // Fetch role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        currentRole.value = userDoc.data().role;
        console.log("User Role:", currentRole.value);
      }
    } else {
      currentUser.value = null;
      currentRole.value = "";
      console.log("Current user after logout:", auth.currentUser);
    }
  });
});

const signin = async () => {
  errorMsg.value = "";
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    console.log("Firebase Sign in Successful!");
    console.log(auth.currentUser);
  } catch (error) {
    console.error("Sign in error:", error.code);
    errorMsg.value = error.message;
  }
};

const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("User successfully signed out.");
    console.log("Current user check:", auth.currentUser);
  } catch (error) {
    console.error("Logout error:", error);
  }
};
</script>
