$(function() {

  var upload_image = $(".sell-dropbox-items");
  var i_count = 1;

  function appendImage(image,label_num) {
    var html = `<li class='sell-dropbox-items_container'>
                    <div class='sell-dropbox-items-figure'>
                        <img alt='商品画像' src='${image}'>
                    </div>
                    <a class="sell-dropbox-items-btn sell-image_edit">
                      <p>編集</p>
                    </a>
                    <a class="sell-dropbox-items-btn sell-image_delete" id=${label_num - 1}>
                      <p>削除</p>
                    </a>
                </li>`
    upload_image.append(html);
  }


  // 削除機能
  $(document).on("click",".sell-image_delete",function(e) {
    var input_num = $(this).attr('id');
    $(this).parent().remove();
    document.getElementById('product_images_attributes_0_image'+input_num).value = null
    $("label.sell-dropbox-uploader_container").attr('for','product_images_attributes_0_image'+ input_num);
    $('.sell-dropbox-uploader').removeClass('hidden');
    $('ul.sell-dropbox-items').css('border-right','thin dashed $gray');
    i_count -= 1;
  });

// 4つ以上のときフォームを消す
function ImageCount() {
  var imagelist = $('li.sell-dropbox-items_container');
  if(imagelist.length >= 3){
    $('.sell-dropbox-uploader').addClass('hidden');
    $('ul.sell-dropbox-items').css('border','none');
  }
  else if(imagelist.length < 3){
    $('.sell-dropbox-uploader').removeClass('hidden');
    $('ul.sell-dropbox-items').css('border-right','thin dashed $gray');
  }
  return imagelist.length
}

// ドラッグオーバー定義
  var target = document.getElementById('drop');
  if (target != null) {
    target.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'copy';
    });

  // ドラッグアンドドロップ保存
    target.addEventListener('drop', function (e) {
      e.stopPropagation();
      e.preventDefault();
      document.getElementById('product_images_attributes_0_image'+ i_count).files = e.dataTransfer.files;
    });
  }

// プレヴュー
  $('.product_images').on("change",function(e) {
    for(var i = 0; i < this.files.length; i++){
      const reader = new FileReader();
      reader.onload = function (e) {
        appendImage(e.target.result,i_count);
      }
      reader.readAsDataURL(this.files[i]);
      i_count += 1;
      $("label.sell-dropbox-uploader_container").attr('for','product_images_attributes_0_image'+ i_count);
    }
    ImageCount()
  });

});
