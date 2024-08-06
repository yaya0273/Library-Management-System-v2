var app=new Vue({
    el: "#app",
    delimiters: ['${','}'],
    data:{
        requests:'',
    },
    created(){
        fetch("http://127.0.0.1:5000/api/requests")
        .then(response=>response.json())
        .then(data=>{
            this.requests=data.requests
        })
        .catch(error=>{
            console.error("Error",error);
        });
    },
    methods:{
        putData(uid, bid) {
            fetch(`http://127.0.0.1:5000/api/user/books/${uid}/${bid}/Current`, {
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
    }
)