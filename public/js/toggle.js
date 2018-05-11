function toggleStatus(id,status){
    $(document).ready(function(){
        console.log("hii");
        alert("Are you sure to Done This:")
        $.ajax({
            type:"POST",
            dattype:"json",
            data:{user_id:id,user_status:status},
            url:'https://localhost:3000/checkToggle',
        })
        
    })
}