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
  attr_accessible :name, :content

  ################################### Validations ################################
  validates_presence_of :name
  validates_presence_of :content
  validates_presence_of :post_id

  ################################### Associations ###############################
  belongs_to :post
  
  ################################### Scopes #####################################
  scope :latest, order('updated_at DESC')

  def timestamp
    updated_at.present? ? updated_at.tv_sec*1000 : ""
  end

  def as_json(options)
    #TODO sid instead of id
    attributes.slice('id', 'name', 'content', 'post_id').merge({'timestamp'=>timestamp})
  end
end
