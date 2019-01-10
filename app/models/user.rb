class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :omniauthable, omniauth_providers: [:facebook, :google_oauth2]

  #正規表現
  VALID_TELPHONE_REGEX = /\A(070|080|090)-*\d{4}-*\d{4}\z/

  # バリデーション
  validates :nickname, presence: true
  validates :email, presence: true, uniqueness: true
  validates :encrypted_password, presence: true, length: { minimum: 6 }, confirmation: true
  validates :telephone, presence: true, format: { with: VALID_TELPHONE_REGEX }

  # validates :birth_year, :birth_month, :birth_day, presence: true

  # アソシエーション
  has_one  :address, dependent: :destroy
  accepts_nested_attributes_for :address
  # accepts_nested_attributes_for :address, update_only: true

  has_many :products

  has_many :credits, dependent: :destroy
  accepts_nested_attributes_for :credits

  has_many :sns_credentials
  has_many :comments, dependent: :destroy

  protected
  def self.find_oauth(auth)
    uid = auth.uid
    provider = auth.provider
    snscredential = SnsCredential.where(uid: uid, provider: provider).first
    if snscredential.present?
      user = User.where(id: snscredential.user_id).first
    else
      user = User.where(email: auth.info.email).first
      if user.present?
        SnsCredential.create(
          uid: uid,
          provider: provider,
          user_id: user.id
          )
      else
        user = User.create(
          nickname: auth.info.name,
          email:    auth.info.email,
          password: Devise.friendly_token[0, 20],
          telephone: "08000000000"
          )
        SnsCredential.create(
          uid: uid,
          provider: provider,
          user_id: user.id
          )
      end
    end
    return user
  end
end
