var app=new Vue({
    el: "#app",
    delimiters: ['${','}'],
    data:{
        id:'',
        p1:'',
        p2:'',
        email:''
    },
    methods:{
        Register() {
            fetch('http://127.0.0.1:5000/api/user', {
              method: 'POST', 
              headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify({ id:this.id,p1:this.p1,p2:this.p2,email:this.email}) 
            })
              .then(response => response.json())
              .then(data => {
                if(data.Status==201){
                    console.log('Data submitted successfully:', data);
                    window.location.href='/user/'+this.id;
                }
                else if(data.Status==400){
                        alert("Username Taken")
                }
                else if(data.Status==401){
                    alert("Passwords do not match")
            }
              })
              .catch(error => {
                console.error('Error submitting data:', error);
              });
        }
    }
    }
)