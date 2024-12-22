$(document).ready(function() {
    $('#post-form').submit(function(e) {
        e.preventDefault();
        var formData = new FormData();

        let post_caption = $("#post-caption").val();
        let post_visibility = $("#visibility").val();
        formData.append('post-caption', post_caption);
        formData.append('visibility', post_visibility);

        var fileInput = $('#post-thumbnail')[0];
        console.log("post_caption", post_caption)
        console.log("post_visibility", post_visibility)
        console.log("fileInput", fileInput)
        console.log("fileInput length", fileInput.length)
        if(fileInput.files.length > 0) {
            var file = fileInput.files[0];
            var fileName = file.name; // Extract the filename
            formData.append('post-thumbnail', file, fileName);
        }

        $.ajax({
            url: '/create-post/',
            type: 'POST',
            dataType: 'json',
            data: formData,
            processData: false,
            contentType: false,

            success: function(res) {
                console.log("Post Saved to DB...");
                console.log(res);
                if(res && res.new_post_content) {
                    $(".post-div").prepend(res.new_post_content);
                    $("#create-post-modal").removeClass("uk-flex uk-open")
                }
            // create-post is-story uk-modal 
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    });
});



//   LIke Post
$(document).on("click", "#like-btn", function(){
    let btn_val = $(this).attr("data-like-btn")
    console.log(btn_val);

    $.ajax({
        url: "/like-post/",
        dataType: "json",
        data:{
            "id":btn_val
        },
        success: function(response){
            if (response.data.bool === true) {
                console.log("Liked");
                console.log(response.data.likes);
                $("#like-count"+btn_val).text(response.data.likes)
                $(".like-btn"+btn_val).addClass("text-blue-500")
                $(".like-btn"+btn_val).removeClass("text-black")
            }else {
                console.log("Unliked");
                console.log(response.data.likes);
                $("#like-count"+btn_val).text(response.data.likes)
                $("#like-count"+btn_val).text(response.data.likes)
                $(".like-btn"+btn_val).addClass("text-black")
                $(".like-btn"+btn_val).removeClass("text-blue-500")

            }
            console.log(response.data.bool);
        }
    })
})


// Comment on post
$(document).on("click", "#comment-btn", function(){
    let id = $(this).attr("data-comment-btn")
    let comment = $("#comment-input"+id).val()

    console.log(id);
    console.log(comment);

    $.ajax({
        url: "/comment-post/",
        dataType: "json",
        data:{
            "id":id,
            "comment":comment,
        },
        success: function(res){

            let newComment = '<div class="flex card shadow p-2" id="comment-div'+res.data.comment_id+'">\
                    <div class="w-10 h-10 rounded-full relative flex-shrink-0">\
                        <img src="' + res.data.profile_image + '" alt="" class="absolute h-full rounded-full w-full">\
                    </div>\
                    <div>\
                        <div class="text-gray-700 py-2 px-3 rounded-md bg-gray-100 relative lg:ml-5 ml-2 lg:mr-12 dark:bg-gray-800 dark:text-gray-100 flex items-center">\
                            <p class="leading-6 flex-grow">'+res.data.comment+'</p>\
                                <button class="ml-auto text-xs ml-3 mr-3" id="delete-comment" data-delete-comment="'+res.data.comment_id+'"> <i class="fas fa-trash text-red-500"></i> </button>\
                        </div>\
                        <div class="text-sm flex items-center space-x-3 mt-2 ml-5">\
                            <a id="like-comment-btn" data-like-comment="'+res.data.comment_id+'" class="like-comment'+res.data.comment_id+' text-red-500" style="color: gray;" > <i id="comment-icon'+res.data.comment_id+'" class=" fas fa-heart  "></i></a> <small><span class="" id="comment-likes-count'+res.data.comment_id+'">0</span></small>\
                            <details >\
                                <summary><div class="">Reply</div></summary>\
                                <details-menu role="menu" class="origin-topf-right relative right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">\
                                    <div class="pyf-1" role="none">\
                                        <div method="POST" class="p-1 d-flex" action="#" role="none">\
                                            <input type="text" class="with-border" name="" id="reply-input'+res.data.comment_id+'">\
                                            <button id="reply-comment-btn" data-reply-comment-btn="'+res.data.comment_id+'" class="block w-fulfl text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 reply-comment-btn'+res.data.comment_id+'" role="menuitem">\
                                            <ion-icon name="send"></ion-icon>\
                                        </button>\
                                        </div>\
                                    </div>\
                                </details-menu>\
                            </details>\
                            <span> <small>' + res.data.date + ' ago</small> </span>\
                        </div>\
                        <div class="reply-div'+res.data.comment_id+'">\
                        </div>\
                    </div>\
                </div>\
            '
            $("#comment-div"+id).prepend(newComment);
            $("#comment-count"+id).text(res.data.comment_count);
            $("#comment-input"+id).val("")
            
            console.log(response.data.bool);
        }
    })
})




//   LIke Comment
$(document).on("click", "#like-comment-btn", function(){
    let id = $(this).attr("data-like-comment")
    console.log(id);

    $.ajax({
        url: "/like-comment/",
        dataType: "json",
        data:{
            "id":id
        },
        success: function(response){
            console.log(response.data.bool);
            console.log(response.data.likes);

            if (response.data.bool === true) {

                $("#comment-likes-count"+id).text(response.data.likes)
                $(".like-comment"+id).css("color", "red")

            }else {
                console.log("Unliked");
                console.log(response.data.likes);
                $("#comment-likes-count"+id).text(response.data.likes)
                $('#comment-icon'+id).removeClass(' text-red-600 ');
                console.log($('.comment-icon'+id));
                $("#comment-likes-count"+id).removeClass(' text-red-600 ');
                $(".like-comment"+id).css("color", "gray")


            }
        }
    })
})


// Reply Comment
$(document).on("click", "#reply-comment-btn", function(){
    let id = $(this).attr("data-reply-comment-btn")
    let reply = $("#reply-input"+id).val()

    console.log(id);
    console.log(reply);

    $.ajax({
        url: "/reply-comment/",
        dataType: "json",
        data:{
            "id":id,
            "reply":reply,
        },
        success: function(res){

            let newReply = ' <div class="flex mr-12 mb-2 mt-2" style="margin-right: 20px;">\
                <div class="w-10 h-10 rounded-full relative flex-shrink-0">\
                    <img src="'+res.data.profile_image+'" style="width: 40px; height: 40px;" alt="" class="absolute h-full rounded-full w-full">\
                </div>\
                <div>\
                    <div class="text-gray-700 py-2 px-3 rounded-md bg-gray-100 relative lg:ml-5 ml-2 lg:mr-12 dark:bg-gray-800 dark:text-gray-100">\
                        <p class="leading-6">'+ res.data.reply +'</p>\
                        <div class="absolute w-3 h-3 top-3 -left-1 bg-gray-100 transform rotate-45 dark:bg-gray-800"></div>\
                    </div>\
                    <span> <small>'+ res.data.date +' ago</small> </span>\
                    \
                </div>\
            </div>\
            '
            $(".reply-div"+id).prepend(newReply);
            $("#reply-input"+id).val("")
            
            console.log(res.data.bool);
        }
    })
})


// UnFriend User
$(document).on("click", "#delete-comment", function(){
    let id = $(this).attr("data-delete-comment")
    console.log(id);

    $.ajax({
        url: "/delete-comment/",
        dataType: "json",
        data: {
            "id":id
        },
        success: function(response){
            console.log(response);
            $("#comment-div"+id).addClass("d-none")
        }
    })
})


// Add Friend
$(document).on("click", "#add-friend", function(){
    let id = $(this).attr("data-friend-id")
    console.log(id);

    $.ajax({
        url: "/add-friend/",
        dataType: "json",
        data:{
            "id":id
        },
        success: function(response){
            console.log("Bool ==",response.bool);
            if (response.bool == true) {
                $("#friend-text").html("<i class='fas fa-user-minus'></i> Cancel Request ")
                $(".add-friend"+id).addClass("bg-red-600")
                $(".add-friend"+id).removeClass("bg-blue-600")
            }
            if (response.bool == false) {
                $("#friend-text").html("<i class='fas fa-user-plus'></i> Add Friend ")
                $(".add-friend"+id).addClass("bg-blue-600")
                $(".add-friend"+id).removeClass("bg-red-600")
            }
        }
    })
})


// Accept Friend Request
$(document).on("click", "#accept-friend-request", function(){
    let id = $(this).attr("data-request-id")
    console.log(id);

    $.ajax({
        url: "/accept-friend-request/",
        dataType: "json",
        data: {
            "id":id
        },
        success: function(response){
            console.log(response.data);
            $(".reject-friend-request-hide"+id).hide()
            $(".accept-friend-request"+id).html("<i class='fas fa-check-circle'></i> Friend Request Accepted")
            $(".accept-friend-request"+id).addClass("text-white")
        }
    })
})


// Reject Friend Request
$(document).on("click", "#reject-friend-request", function(){
    let id = $(this).attr("data-request-id")
    console.log(id);

    $.ajax({
        url: "/reject-friend-request/",
        dataType: "json",
        data: {
            "id":id
        },
        success: function(response){
            console.log(response.data);
            $(".accept-friend-request-hide"+id).hide()
            $(".reject-friend-request"+id).html("<i class='fas fa-check-circle'></i> Friend Request Rejected")
            $(".reject-friend-request"+id).addClass("text-white")
        }
    })
})



// UnFriend User
$(document).on("click", "#unfriend", function(){
    let id = $(this).attr("data-friend-id")
    console.log(id);

    $.ajax({
        url: "/unfriend/",
        dataType: "json",
        data: {
            "id":id
        },
        success: function(response){
            console.log(response);
            $("#unfriend-text").html("<i class='fas fa-check-circle'></i> Friend Removed ")
            $(".unfriend"+id).addClass("bg-blue-600")
            $(".unfriend"+id).removeClass("bg-red-600")
        }
    })
})


$(document).on("click", "#block-user-btn", function(){
    let id = $(this).attr("data-block-user")
    
    $.ajax({
        url: "/block-user/",
        dataType: "json",
        data: {
            "id":id
        },
        success: function(response){
            console.log(response);
            $(".block-text"+id).html("<i class='fas fa-check-circle'></i> User Blocked Successfully. ")
        }
    })
})