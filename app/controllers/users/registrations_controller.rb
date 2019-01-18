class Users::RegistrationsController < Devise::RegistrationsController
  # before_action :configure_sign_up_params, only: [:create]
  # before_action :configure_account_update_params, only: [:update]
  # prepend_before_action :require_no_authentication, only: [:create]
  prepend_before_action :require_no_authentication, only: [:sms_confirmation, :address, :credit, :create]
  before_action :user_new, only:[:sms_confirmation, :address, :credit, :create]
  skip_before_action :authenticate_user!

  def registration
    @user = User.new
  end

  def sms_confirmation
    # @user.build_address
    unless verify_recaptcha
      render action: :registration
    end
  end

  def address
    @user.build_address
  end

  def credit
    @user.credits.build

    time = Time.new
    min_year = time.year.to_s[2,2].to_i
    max_year = min_year + 10
    @years = [*(min_year..max_year)]
  end

  def done

  end

  def create
    @user.save
    session[:user_id] = @user.id
    yield resource if block_given?
    if resource.persisted?
      if resource.active_for_authentication?
        set_flash_message! :notice, :signed_up
        sign_up(@user, current_user)
        respond_with resource, location: after_sign_up_path_for(resource)
      else
        set_flash_message! :notice, :"signed_up_but_#{resource.inactive_message}"
        expire_data_after_sign_in!
        respond_with resource, location: after_inactive_sign_up_path_for(resource)
      end
    else
      render action: :registration
      clean_up_passwords resource
      set_minimum_password_length
    end
  end

  private

  def user_new
    @user = User.new(user_params)
  end

  def user_params
    params.require(:user).permit(:nickname, :email, :password, :password_confirmation, :telephone, address_attributes: [ :first_name, :first_name, :last_name, :first_name_phonetic, :last_name_phonetic, :id, :postal_code, :prefecture, :municipality, :address_number, :building_name],
      credits_attributes: [:id, :card_number, :expiration_month, :expiration_year, :security_code])
  end

  def after_sign_up_path_for(resource)
    signup_done_path
  end

  def after_failed_sign_up_path_for(resource)
    signup_registration_path
  end

end
