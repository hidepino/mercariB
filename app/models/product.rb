class Product < ApplicationRecord
  belongs_to :buyer, class_name: 'User', :foreign_key => 'buyer_id', optional: true
  belongs_to :seller, class_name: 'User', :foreign_key => 'seller_id'
  belongs_to :user, optional: true
  belongs_to :category
  belongs_to :brand, optional: true
  belongs_to :size
  belongs_to :sell_status
  has_many :images, dependent: :destroy
  accepts_nested_attributes_for :images, reject_if: proc { |attributes| attributes['image'].blank? }
  accepts_nested_attributes_for :brand, reject_if: proc { |attributes| attributes['name'].blank? }

  has_many :comments, dependent: :destroy

  validates :seller,:name,:info, :category_id, :status, :delivery_fee_owner, :shipping_method, :prefecture, :delivery_date, :price, presence: true

  def other_products
    other_products = Product.where(seller_id: self.seller_id)
  end

  def self.search(search)
    return "同様の商品は出品された事がありません。" unless search
    Product.where(category_id: search[:category_id], brand_id: search[:brand_id], status: search[:status])
  end

end
