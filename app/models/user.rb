class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  validates :nickname, presence: true
  validates :email, presence: true, uniqueness: true
  validates :encrypted_password, presence: true, length: { minimum: 6 }, confirmation: true
  # validates :birth_year, :birth_month, :birth_day, presence: true

  has_one  :address, dependent: :destroy
  accepts_nested_attributes_for :address
  # accepts_nested_attributes_for :address, update_only: true

  has_many :products

  has_many :credit_cards, dependent: :destroy
  accepts_nested_attributes_for :credit_cards
end
