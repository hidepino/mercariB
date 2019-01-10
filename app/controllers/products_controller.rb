class ProductsController < ApplicationController
  before_action :product_new, only:[:new]
  before_action :product_info, only: [:show, :item_show, :destroy]
  skip_before_action :authenticate_user!, only: [:show, :item_show, :search, :price_recommend, :price_recommend_result]

  def new
    @product.images.build
  end

  def show
    @images = @product.images
    gon.images = @images.length
    @sell_user = @product.seller
    @sell_other_products = Product.where(seller_id: @product.seller_id)
    @sell_product_brand = @product.brand
    @sell_product_category = @product.category

    if @product.brand_id.present? && @product.category_id.present?
      @related_items = Product.where(brand_id: @product.brand_id, category_id: @product.category_id).where.not(id: @product.id)
    else @product.brand_id.present? || @product.category_id.present?
      @related_items = Product.where("brand_id = ? or category_id = ?", @product.brand_id, @product.category_id)
    end
  end

  def destroy
    if current_user.id == @product.seller_id
      if @product.destroy
        redirect_to root_path
      else
        render :show
      end
    end
  end

  def item_show
    @image = @product.images[0]
  end

  def create
    @product = Product.new(product_params)
    if @product.brand
      @product.brand = Brand.find_or_create_by(name: @product.brand.name)
    end
    if params[:image]
      if @product.save
        params[:image].each do |i|
          @product.images.create(product_id: @product.id, image: i)
        end
        redirect_to root_path
      else
        @product.images.build
        render action: :new
      end
    else
      @product.images.build
      flash.now[:alert] = "画像を設定してください"
      render action: :new
    end
  end

  def search
    params_val = params[:q]
    gon.parent_val = params_val[:category_id]
    gon.child_val = params_val[:category_id_eq]
    gon.g_child_val = params_val[:category_id_in]
    gon.size_group_val = params_val[:size_id]
    gon.size_val = params_val[:size_id_in]
    gon.sort_val = params_val[:s]

    @search_data    = Product.ransack(search_params)
    @keyword        = search_params[:info_or_name_or_brand_name_or_category_name_cont_all]
    @products       = Product.order(id: :DESC).includes(:images)
    @product_result = @search_data.result(distinct: true)
    @product_count  = @product_result.length

    @parents        = Category.where(belongs:"parent")
    gon.children    = Category.where(belongs:"child")
    gon.g_children  = Category.where(belongs:"g_child")

    @size_groups = SizeGroup.all
    gon.sizes = Size.all

  end

  def transaction
    @product = Product.find(params[:format])
    if @product.buyer_id != nil
      redirect_to product_path(@product)
    end
  end

  def completed_transaction
    ActiveRecord::Base.transaction do

      @product = Product.find(params[:id])
      require 'payjp'
      Payjp.api_key = PAYJP_SECRET_KEY

      Payjp::Charge.create(
        amount:  @product.price,
        card:    params['payjp-token'],
        currency: 'jpy',
      )
      @product.update!(buyer_id: current_user.id,sell_status_id: 2)
    end
  end

  #ユーザー出品商品一覧
  def listing
    @products = Product.where(seller_id: current_user.id, buyer_id: nil)
  end

  def in_progress
    @products = Product.where(seller_id: current_user.id).where.not(buyer_id: nil)
  end

  def completed
    @products = Product.where(seller_id: current_user.id).where.not(buyer_id: nil)
  end

  #ユーザー購入済み商品一覧
  def purchased
    @product = Product.where(buyer_id: current_user.id, sell_status_id: 2)
  end

  # 商品価格査定
  def price_recommend
    @product = PriceRecommend.new
  end

  def price_recommend_result
    @product = PriceRecommend.new(recommend_params)
    @same_product = Product.search(recommend_params)
    @same_product_price = @same_product.average(:price).floor.to_s(:delimited) if @same_product.present?
  end


  private
  def product_new
    @product = Product.new
  end


  def product_params
    params.require(:product).permit(
      :name,
      :info,
      :price,
      :category_id,
      :size_id,
      :status,
      :delivery_fee_owner,
      :shipping_method,
      :delivery_date,
      :prefecture,
      images_attributes: [:id,:product_id,:image,:_destroy],
      brand_attributes: [:id,:name]
    ).merge(seller_id: current_user.id,sell_status_id: 1)
  end

  def product_info
    @product = Product.find(params[:id])
  end

  def search_params
    if params[:q][:category_id_in].blank?
      if params[:q][:category_id_eq].present?
        categories = Category.where("ancestry LIKE ?", "%/#{params[:q][:category_id_eq]}")
        category_ids = categories.map(&:id)
      else
        categories = Category.where("ancestry LIKE ?", "#{params[:q][:category_id]}/%")
        category_ids = categories.map(&:id)
      end
      params[:q][:category_id_in] = category_ids
    end

    params.require(:q).permit(
      :s,
      :info_or_name_or_brand_name_or_category_name_cont_all,
      {:category_id_in => []},
      :brand_name_cont_all,
      {:size_id_in => []},
      :price_gteq,
      :price_lteq,
      {:status_eq_any => []},
      {:delivery_fee_owner_eq_any => []},
      :buyer_id_null,
      :buyer_id_not_null
      ) unless params[:q].blank?
  end

  def recommend_params
    params.require(:price_recommend).permit(
      :category_id,
      :brand_id,
      :status)
  end

  def move_to_login
    redirect_to new_user_session_path unless user_signed_in?
  end
end
