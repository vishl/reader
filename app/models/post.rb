# == Schema Information
#
# Table name: posts
#
#  id         :integer         not null, primary key
#  name       :string(255)
#  content    :text
#  comment    :text
#  created_at :datetime
#  updated_at :datetime
#  forum_id   :integer
#

class Post < ActiveRecord::Base
  ################################### Attributes #################################
  attr_accessible :name, :content, :comment

  ################################### Validations ################################
  validates_presence_of :name
  validates_presence_of :content
  validates_presence_of :forum_id

  ################################### Associations ###############################
  has_many :comments
  belongs_to :forum

  ################################### Scopes #####################################
  scope :latest, order('updated_at DESC')

  def as_json(options)
    #TODO sid instead of id
    attributes.slice("id", "name", "content", "comment").merge({
      "forum_sid"=>forum.sid, "timestamp"=>(updated_at.present? ? updated_at.tv_sec*1000 : ""), 
      "comments"=>comments.order("updated_at").all})
  end
end
