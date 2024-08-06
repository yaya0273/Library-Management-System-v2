var app=new Vue({
    el: "#app",
    delimiters: ['${','}'],
    data:{
        id:'',
        password:''
    },
    methods:{
        Login(){
            fetch('http://127.0.0.1:5000/api/user/'+this.id)
            .then(response=>response.json())
            .then(data=>{
                if(this.password==data.Password){
                    if(this.id=='admin'){
                        window.location.href='/admin';
                    }
                    else{
                        window.location.href='/user/'+this.id;
                    }
                }

            })
            .catch(error=>{
                console.error("Error",error);
            });
            
        }
    }
    }
)