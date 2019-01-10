class CategoriesController < ApplicationController
  skip_before_action :authenticate_user!

  def index
    @product = Product.all
    if params[:format].to_i < 13
      products = Category.where("ancestry LIKE ?", "#{params[:format]}/%")
      products_ids = products.map{|product| product.id }
      @product_result = Product.where(category_id:products_ids)
    elsif params[:format].to_i > 13 && params[:format].to_i < 157
      products = Category.where("ancestry LIKE ?", "%/#{params[:format]}")
      products_ids = products.map{|product| product.id }
      @product_result = Product.where(category_id:products_ids)
    else
      @product_result = Product.where(category_id: params[:format])
    end
    @product_count = @product_result.length
  end

  def brands
    @product = Product.all
    @product_result = @product.where(brand_id: params[:format])
    @product_count = @product_result.length
  end
end

