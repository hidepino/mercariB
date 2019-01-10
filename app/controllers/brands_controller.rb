class BrandsController < ApplicationController
  skip_before_action :authenticate_user!
  def index
    @brands = Brand.where('name LIKE(?)',"%#{params[:keyword]}%")
    respond_to do |format|
      format.html
      format.json
    end
  end
end
