# == Schema Information
#
# Table name: comments
#
#  id         :integer         not null, primary key
#  name       :string(255)
#  content    :text
#  post_id    :integer
#  created_at :datetime
#  updated_at :datetime
#

class Comment < ActiveRecord::Base
  ################################### Validations ################################
  validates_presence_of :name
  validates_presence_of :content
  validates_presence_of :post_id

  ################################### Associations ###############################
  belongs_to :post
end
