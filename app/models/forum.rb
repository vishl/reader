# == Schema Information
#
# Table name: forums
#
#  id         :integer         not null, primary key
#  title      :string(255)
#  sid        :string(255)
#  created_at :datetime
#  updated_at :datetime
#

class Forum < ActiveRecord::Base
  ################################### Associations ###############################
  has_many :posts
  has_many :comments, :through=>:posts
end
