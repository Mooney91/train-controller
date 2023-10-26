<template>
    <div>
      
      <h2>Logga in</h2>
      <form @submit="login" class="login-form">
        <label class="input-label">Användarnamn</label>
        <input type="email" required class="input" v-model="credentials.username" @input="updateCredentials" />
  
        <label class="input-label">Lösenord</label>
        <input type="password" required class="input" v-model="credentials.password" @input="updateCredentials" />
  
        <input type="submit" value="Logga in" class="button loginButton" @click="login"/>
        <input type="button" value="Registrera" class="button registerButton" @click="register" />
      </form>
    </div>
</template>
  
<script>
import { useUserStore } from '../stores/UserStore';

//   import authModel from "../models/auth.js";
//   import { toast } from "../utils.js";
  
  export default {
    setup() { 
      const userStore = useUserStore()

      return { userStore }
    },
    data() {
      return {
        credentials: {
          username: "",
          password: "",
        },
      }
    },
    props:  {
      backend: String
    },
    methods: {
        toast(message) {
            const toast = document.getElementsByClassName("toast")[0];

            toast.querySelector(".toast-body").innerHTML = message;

            toast.classList.add("visible");

            setTimeout(function () {
                toast.className = toast.className.replace("visible", "");
            },
            3000
            );

        },
      async login() {
        let username = this.credentials.username
        let password = this.credentials.password

        const user = {
            username: username,
            password: password,
        };
        const response = await fetch(`${this.backend}/auth/login`, {
            body: JSON.stringify(user),
            headers: {
                'content-type': "application/json",
            },
            method: "POST",
        });

        const result = await response.json();
      
        this.userStore.addUser(result.data);
        this.$router.push(`/`);


        
      },
      async register() {
        const user = {
            username: this.credentials.username,
            password: this.credentials.password,
        };

        const response = await fetch(`${this.backend}/auth/register`, {
            body: JSON.stringify(user),
            headers: {
                'content-type': "application/json",
            },
            method: "POST",
        });
                        
        const result = await response.json();

        console.log(result);   
      },
      updateCredentials() {
        console.log(this.credentials);
      },
    },
  };
  </script>
  
  <style scoped>
  </style>

