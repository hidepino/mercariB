class UsersController < ApplicationController

  def index

  end

  # def create

  # end

  def new
  end

  def edit
  end

  def profile_update
    if current_user.update(user_profile_params)
      redirect_to mypage_profile_path
    else
      render action: :edit
    end
  end


  def show
  end

  def destroy
  end

  def set_user
  end

  def update
    if current_user.update(user_params)
      redirect_to root_path
    else
      render action: :set_user
    end
  end

  private
  def user_params
    params.require(:user).permit(
      :birth_year,
      :birth_month,
      :birth_day,
      address_attributes: [:first_name,
                           :last_name,
                           :first_name_phonetic,
                           :last_name_phonetic,
                           :postal_code,
                           :prefecture,
                           :municipality,
                           :address_number,
                           :building_name])
  end

  def user_profile_params
    params.require(:user).permit(:nickname, :profile)
  end
end
