const app = Vue.createApp({
  data() {
      return {

      }
  }
});

app.component('app-header', {
  name: 'AppHeader',
  template: `
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
    <a class="navbar-brand" href="#">Lab 7</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
  
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
           <router-link to="/" class="nav-link">Home</router-link>
         </li>
      </ul>
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
            <router-link to="/upload" class="nav-link">Upload</router-link>
        </li>
      </ul>
    </div>
  </nav>
  `
});

app.component('app-footer', {
  name: 'AppFooter',
  template: `
  <footer>
      <div class="container">
          <p>Copyright &copy; {{ year }} Flask Inc.</p>
      </div>
  </footer>
  `,
  data() {
      return {
          year: (new Date).getFullYear()
      }
  }
});


const UploadForm = {
  name: 'uploadform',
  template:`
  <h1>Upload Form</h1>
  <div :class="[className]">
      <ul>
          <li v-for="message in messages">{{message}}</li>
      </ul>
  </div>
  <form method="POST" id="uploadForm" @submit.prevent="uploadPhoto">
      <fieldset class="form-group">
          <label for="description">Description</label>
          <textarea type="text" name="description" class="form-control"></textarea>
      </fieldset>
      <fieldset class="form-group">
          <label for="photo">Photo Upload</label>
          <input type="file" name="photo" id="photo" class="form-control" accept="image/*" draggable="true">
      </fieldset>
      <button type="submit" class="btn btn-primary">Submit</button>
  </form>
  </div>
  `,
  data(){
      return {
          messages:[],
          className:''
      }
  },
  methods: {
      uploadPhoto(){
          let uploadForm = document.getElementById('uploadForm');
          let form_data = new FormData(uploadForm)
          let self=this;

          fetch("/api/upload",{
          method: 'POST',
          body: form_data,
          headers: {
              'X-CSRFToken': token
          },
          credentials:'same-origin'
      })
      .then(function(response){
          return response.json();
      })
      .then(function(jsonResponse){
          if (jsonResponse['upload_data']){
              self.messages = [jsonResponse['upload_data']['message']];
              self.className="dataupload"
          } else {
              self.messages = jsonResponse['upload_errors']['errors'];
              self.className="upload_errors"
          }
          
      })
      .catch(function(error){
          console.log(error);
      });

      }
  }
};

const Home = {
  name: 'Home',
  template: `
  <div class="jumbotron">
      <h1>Lab 7</h1>
      <p class="lead">In this lab we will demonstrate VueJS working with Forms and Form Validation from Flask-WTF.</p>
  </div>
  `,
  data() {
      return {}
  }
};

const NotFound = {
  name: 'NotFound',
  template: `
  <div>
      <h1>404 - Not Found</h1>
  </div>
  `,
  data() {
      return {}
  }
};

// Define Routes
const routes = [
  { path: "/", component: Home },
  // Put other routes here
  {path: "/upload", component: UploadForm},
  // This is a catch all route in case none of the above matches
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes, // short for `routes: routes`
});

app.use(router);

app.mount('#app');