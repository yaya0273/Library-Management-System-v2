var app=new Vue({
    el: "#app",
    delimiters: ['${','}'],
    data:{
        issued:''
    },
    created(){
        fetch("http://127.0.0.1:5000/api/issued")
        .then(response=>response.json())
        .then(data=>{
            this.issued=data.issued
        })
        .catch(error=>{
            console.error("Error",error);
        });
    },
    methods:{
        Revoke(uid,bid){
            fetch(`http://127.0.0.1:5000/api/user/books/${uid}/${bid}/Completed`, {
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
        }
    }
    }
)