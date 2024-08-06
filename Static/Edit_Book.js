var app=new Vue({
    el: "#app",
    delimiters: ['${','}'],
    data:{
        title:'',
        author:'',
        sid:'',
        bid:'',
        sections:''
    },
    created(){
      const url = window.location.href.split('/');
      this.bid = url[url.length - 1];
      fetch(`http://127.0.0.1:5000/api/book/${this.bid}`)
      .then(response=>response.json())
      .then(data=>{
          this.title=data.book.Name
          this.author=data.book.Author
      })
      .catch(error=>{
          console.error("Error",error);
      });
      fetch(`http://127.0.0.1:5000/api/sections`)
      .then(response=>response.json())
      .then(data=>{
          this.sections=data.sections
      })
      .catch(error=>{
          console.error("Error",error);
      });
    },
    methods:{
        Edit() {
            console.log(author)
            fetch(`http://127.0.0.1:5000/api/books/${this.bid}/${this.title}/${this.author}/${this.sid}`, {
              method: 'PUT'
            })
              .then(response => response.json())
              .then(data => {
                    console.log('Data updated successfully:', data);
                    window.location.href='/admin/view/'+this.sid;
              })
              .catch(error => {
                console.error('Error updating data:', error);
              });
        }
    }
    }
)