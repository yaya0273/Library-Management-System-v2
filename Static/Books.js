var app=new Vue({
    el: "#app",
    delimiters: ['${','}'],
    data:{
        id:'',
        books:'',
    },
    created(){
        const url = window.location.href.split('/');
      this.id = url[url.length - 2];
      document.getElementById("id1").innerHTML = `<a class="nav-link " href="/user/${this.id}">My Books</a>`;
      document.getElementById("id2").innerHTML = `<a class="nav-link active" href="/${this.id}/books">Books</a>`;
  
      fetch(`http://127.0.0.1:5000/api/books/${this.id}`)
        .then(response => response.json())
        .then(data => {
          this.books = data.books;
        })
        .catch(error => {
          console.error("Error", error);
        });
    },
    methods:{
        putData(uid, bid) {
            fetch(`http://127.0.0.1:5000/api/user/books/${uid}/${bid}/Requested`, {
              method: 'PUT'
            })
            .then(response => response.json())
              .then(data => {
                if(data.Status==204){
                    console.log('Success:', data);
                    window.location.href="http://127.0.0.1:5000/user/"+this.id
                }
                else{
                    alert("Book Limit Reached (5)")
                }
              })
              .catch(error => {
                console.error('Error:', error);
              });
          },
    }
    }
)