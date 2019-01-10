$(function(){
  var checkboxes = $("input:checkbox")
  var checkbox_wrap = $('.check-box-wrap')
  var child_select = $(".child_select")
  var clear_btn = $('.btn__clear')
  var g_child_check_boxes = $(".g_child_check_boxes")
  var hide_wrap = $(".hide-wrap")
  var parent_select = $('.parent_select')
  var price_select = $('.price_select')
  var search_input = $("input[type=search]")
  var sort_select = $('#q_s')
  var selects = $('select')
  var searchbar = $('.search-bar')
  var searchbar_button = $('.search-bar__button')
  var size_check_boxes = $(".size_check_boxes")
  var size_group_select = $('.size_group_select')
  var detail_search = $('.product_search__detail')

  if (gon.search_params) {
    var parent_val  = gon.search_params.category_id
    var child_val   = gon.search_params.category_id_eq
    var g_child_val = gon.search_params.category_id_in
    var size_group_val = gon.search_params.size_size_group_id
    var size_val = gon.search_params.size_id_in
    var sort_val = gon.search_params.s
  }

  $(document).ready(function(){
    if (parent_val){
      parent_select.val(parent_val)
      if (child_val){
        var parent_results = filter_children(gon.children, parent_val)
        append_child_option(child_select, g_child_check_boxes, parent_results);
        hide_wrap.show();
        child_select.val(child_val)
        if (g_child_val){
          append_g_child_check_boxes(parent_val, child_val, g_child_check_boxes);
          g_child_val.forEach(function(val){
            $(`#q_category_id_in_${val}`).prop("checked",true);
          })
        }
      }
    }
    if (size_val){
      size_group_select.val(size_group_val)
      var size_group_results = filter_size(gon.sizes, size_group_val)
      append_size_check_boxes(size_check_boxes, size_group_results);
      size_val.forEach(function(val){
        $(`#q_size_id_in_${val}`).prop("checked",true);
      })
    }
    if (sort_val){
      sort_select.val(sort_val)
    }
  })

  function append_child_option(select, check_boxes, results){
    select.empty()
    check_boxes.empty();
    select.append(`<option value="">---</option>`);
    results.forEach(function(result){
      select.append(`<option value="${result.id}">${result.name}</option>`)
    })
  }

  function append_g_child_check_boxes(parent_val, child_val, check_boxes){
    var ancestry = `${parent_val}/${child_val}`
    var results = filter_children(gon.g_children, ancestry)
    check_boxes.empty();
    results.forEach(function(result){
      check_boxes.append(`<div  class="form__checkbox">\n\t<input type="checkbox" value="${result.id}" name="q[category_id_in][]" id="q_category_id_in_${result.id}">\n\t<label for="q_category_id_in_${result.id}">${result.name}</label>\n</div>`)
    })
  }

  function append_size_check_boxes(check_box, results) {
    check_box.empty();
    results.forEach(function(result){
      check_box.append(`<div class="form__checkbox">\n<input type="checkbox" value="${result.id}" name="q[size_id_in][]" id="q_size_id_in_${result.id}">\n<label for="q_size_id_in_${result.id}">${result.size}</label>\n</div>`)
    })
  }

  function filter_size(sizes, value){
    results = sizes.filter(function(e){
      if (e.size_group_id == value){
        return e
      }
    })
    return results
  }

  function filter_children(children, value){
    results = children.filter(function(e){
      if (e.ancestry == value){
        return e
      }
    })
    return results
  }


  parent_select.change(function() {
    var parent_val = $(this).val();
    if ($.isEmptyObject(parent_val)){
      hide_wrap.hide();
    } else {
      hide_wrap.show();
    }
    var parent_results = filter_children(gon.children, parent_val)
    append_child_option(child_select, g_child_check_boxes, parent_results);
  });

  child_select.change(function() {
    var parent_val = parent_select.val();
    var child_val = $(this).val();
    append_g_child_check_boxes(parent_val, child_val, g_child_check_boxes);
  });

  size_group_select.change(function() {
    var size_group_val = $(this).val();
    var size_group_results = filter_size(gon.sizes, size_group_val)
    append_size_check_boxes(size_check_boxes, size_group_results);
  });

  price_select.change(function(){
    var price_select_val = $(this).val().split(" ~ ");
    var min_price = price_select_val[0]
    var max_price = price_select_val[1]
    $('.min_price').val(min_price)
    $('.max_price').val(max_price)
  })

  sort_select.change(function(){
    detail_search.submit();
  })

  clear_btn.click(function(){
    search_input.val('');
    checkboxes.attr("checked",false);
    checkbox_wrap.empty();
    selects.val('');
    child_select.hide();
  })

  searchbar_button.click(function(){
    searchbar.toggle();
  })

});

