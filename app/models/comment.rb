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
  attr_accessible :content

  ################################### Validations ################################
  validates_presence_of :content
  validates_presence_of :post_id
  validates_presence_of :user_id

  ################################### Associations ###############################
  belongs_to :post
  belongs_to :user
  
  ################################### Scopes #####################################
  scope :latest, order('updated_at DESC')

  def name
    user.name
  end

  def timestamp
    updated_at.present? ? updated_at.tv_sec*1000 : ""
  end

  def as_json(options)
    #TODO sid instead of id
    attributes.slice('id', 'content', 'post_id').merge({'name'=>name, 'timestamp'=>timestamp})
  end

end
