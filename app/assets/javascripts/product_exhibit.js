$(function() {
// 金額算出
  function ReplaceNum(num) {
    var str = new String(num).replace(/,/g, "");
    while(str != (str = str.replace(/^(-?\d+)(\d{3})/, "$1,$2")));
    return str;
  }

  $(".sell-form-text_number").on("keyup", function(e) {
    var input = $(this).val();
    var price = Number(input.replace(/[^0-9]/g, ''));

    if( price >= 300 && price <= 9999999 ){
      var fee = Math.floor(price / 10);
      var gains = Math.floor(price - fee);
      var fee_num = ReplaceNum(fee)
      $(".sell-form-price-fee-num").text('¥ ' + fee_num);
      var gains_num = ReplaceNum(gains)
      $(".sell-form-price-gains-num").text('¥ ' + gains_num);
      }
    else {
      $(".sell-form-price-fee-num").text('-');
      $(".sell-form-price-gains-num").text('-');
    }
  });

// ブランド名検索
  var brand_list = $('.brand-search-result')

  function appendBrand(brand) {
    var html = `<a src= "">
                  <li class="sell-contents-brand">${ brand.name }</li>
                </a>`
    brand_list.append(html);
  }

  $(".input_brand").on("keyup", function(e) {
    var input = $(this).val();
    $.ajax({
      type: 'GET',
      url: '/brand/index',
      data: { keyword: input},
      dataType: 'json'
    })
    .done(function(brands) {
      $(".brand-search-result").empty();
      if (brands.length !== 0 && input.length !== 0 ){
        brands.forEach(function(brand) {
          appendBrand(brand);
        });
      }
    })
    .fail(function() {
      alert("ブランドの検索に失敗しました")
    })
  });

  $(document).on("click",".sell-contents-brand",function(e) {
    var brand_name = $(this).html();
    $(".input_brand").val(brand_name);
    $(brand_list).empty();
  });

// カテゴリ条件分岐表示

  var select_parent = $('.form-select_parent')
  var select_child = $('.form-select_child')
  var select_g_child = $('.form-select_g_child')
  var hide_wrap = $(".hide-wrap")
  var hide_wrap2 = $(".second-hide-wrap")
  var hide_wrap3 = $(".third-hide-wrap")
  var parent_val = null

// 編集時の処理
  if (gon.category_g_parent) {
    var parent_val  = gon.category_g_parent
    var child_val   = gon.category_parent
    var g_child_val = gon.category
  } else {
    var parent_val  = gon.category_parent
    var child_val   = gon.category
  }

  $(document).ready(function(){
    if (parent_val){
      select_parent.val(parent_val)
      if (child_val){
        var parent_results = filter_children(gon.children, parent_val)
        append_child_option(select_child, select_g_child, parent_results);
        hide_wrap.show();
        select_child.val(child_val)
        if (g_child_val){
          hide_wrap2.show();
          hide_wrap3.show();
          append_g_child_option(select_g_child,parent_val, child_val);
          select_g_child.val(g_child_val)
        }
      }
    }
  })

  function filter_children(children, value){
    results = children.filter(function(e){
      if (e.ancestry == value){
        return e
      }
    })
    return results
  }

  function append_child_option(select, next_form, results){
    select.empty()
    next_form.empty();
    select.append(`<option value="">---</option>`);
    results.forEach(function(result){
      select.append(`<option value="${result.id}">${result.name}</option>`)
    })
  }

  function append_g_child_option(select, parent_val, child_val){
    var ancestry = `${parent_val}/${child_val}`
    var results = filter_children(gon.g_children, ancestry)
    select.empty();
    if ($.isEmptyObject(results)){
      hide_wrap2.hide();
      hide_wrap3.show();
    } else{
      select.append(`<option value="">---</option>`);
      results.forEach(function(result){
        select.append(`<option value="${result.id}">${result.name}</option>`)
      })
    }
  }

  select_parent.change(function() {
    var parent_val = $(this).val();
    if ($.isEmptyObject(parent_val)){
      hide_wrap.hide();
      hide_wrap2.hide();
      hide_wrap3.hide();
    } else {
      hide_wrap.show();
      hide_wrap2.hide();
      hide_wrap3.hide();
    }
    var parent_results = filter_children(gon.children, parent_val)
    append_child_option(select_child, select_g_child, parent_results);
  });

  select_child.change(function() {
    var parent_val = select_parent.val();
    var child_val  = $(this).val();
    if ($.isEmptyObject(child_val)){
      hide_wrap2.hide();
      hide_wrap3.hide();
    } else {
      hide_wrap2.show();
      hide_wrap3.hide();
    }
    append_g_child_option(select_g_child,parent_val, child_val);
  });

  select_g_child.change(function() {
    var g_child_val  = $(this).val();
    if ($.isEmptyObject(g_child_val)){
      hide_wrap3.hide();
    } else {
      hide_wrap3.show();
    }
  });

});
