$(function(){
  function buildHTML(comment){
    var html = `
      <li class="clearfix comment-box" data-comment-id=${comment.id}>
        <div class="message-user">
          <div class="user-img">
            <img class="user-icon" src="/assets/user-icon.svg" alt="User icon">
          </div>
        </div>
        <div class="message-body">
          <div class="message-text">
            ${comment.content}
          </div>
          <div class="message-icons clearfix">
            <div class="icon-left">
              <i class="time"></i>
              <p class="text">50日前</p>
            </div>
            <div class="icon-right">
              <a class="report" href=""><i class="flag"></i></a>
            </div>
          </div>
          <i class="balloon"></i>
        </div>
      </li>
    `
    return html;
  }

  $('#post-comment').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action')
    $.ajax({
      url: url,
      type: 'POST',
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.messages').append(html);
      $('.text-input').val('');
      $('#post-btn').prop('disabled', false);
    })
    .fail(function() {
      alert('error');
    });
  });

  if (window.location.href.match(/\/products\/\d+/)){
    var interval = setInterval(function(){
    var LastCommentId = $('.comment-box').last().data('comment-id');
    var url = window.location.href + '/comments';
      $.ajax({
        url: url,
        type: "GET",
        data: { id: LastCommentId },
        dataType: "json"
      })
      .done(function(comments){
        var id = LastCommentId;
        comments.forEach(function(comment){
          if ( comment.id > id){
            var html = buildHTML(comment);
            $('.messages').append(html);
          }
        })
        $('#post-btn').prop('disabled', false);
      })
      .fail(function() {
        alert('自動更新に失敗しました(>.<)');
      });
    }, 5000);
  }
});
