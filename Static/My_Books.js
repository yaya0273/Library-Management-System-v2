new Vue({
    el: '#app',
    delimiters: ['${','}'],
    data: {
      id: '',
      bcu: [],
      bco: [],
      bre: [],
    },
    created() {
      const url = window.location.href.split('/');
      this.id = url[url.length - 1];
      document.getElementById("id1").innerHTML = `<a class="nav-link active" href="/user/${this.id}">My Books</a>`;
      document.getElementById("id2").innerHTML = `<a class="nav-link" href="/${this.id}/books">Books</a>`;
  
      fetch(`http://127.0.0.1:5000/api/user/books/${this.id}`)
        .then(response => response.json())
        .then(data => {
          this.bcu = data.bcu;
          this.bco = data.bco;
          this.bre = data.bre;
        })
        .catch(error => {
          console.error("Error", error);
        });
    },
    methods: {
      putData(uid, bid, status) {
        fetch(`http://127.0.0.1:5000/api/user/books/${uid}/${bid}/${status}`, {
          method: 'PUT'
        })
        .then(response => response.json())
        .then(data => {
          if(data.Status==204){
              console.log('Success:', data);
              location.reload()
          }
          else{
              alert("Book Limit Reached (5)")
          }
        })
          .catch(error => {
            console.error('Error:', error);
          });
      },
      deleteData(uid, bid) {
        fetch(`http://127.0.0.1:5000/api/user/books/${uid}/${bid}`, {
          method: 'DELETE'
        })
          .then(response => {
          })
          .then(data => {
            console.log('Success:', data);
            location.reload();
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    }
  });
  