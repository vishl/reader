# == Schema Information
#
# Table name: markers
#
#  id         :integer         not null, primary key
#  user_id    :integer
#  post_id    :integer
#  is_read    :boolean
#  is_starred :boolean
#  is_hidden  :boolean
#  created_at :datetime
#  updated_at :datetime
#  forum_id   :integer
#

class Marker < ActiveRecord::Base
  attr_accessible :user_id, :post_id, :forum_id, :is_read, :is_starred, :is_hidden

  validates_presence_of :user_id, :post_id
  validates_uniqueness_of :user_id, :scope=>:post_id    #one marker per user/post

  belongs_to :user
  belongs_to :post
end
