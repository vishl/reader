#Copyright 2012 Vishal Parikh
#This file is part of Freader.
#Freader is free software: you can redistribute it and/or modify
#it under the terms of the GNU General Public License as published by
#the Free Software Foundation, either version 3 of the License, or
#(at your option) any later version.
#
#Freader is distributed in the hope that it will be useful,
#but WITHOUT ANY WARRANTY; without even the implied warranty of
#MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#GNU General Public License for more details.
#
#You should have received a copy of the GNU General Public License
#along with Freader.  If not, see <http://www.gnu.org/licenses/>.

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
#  user_id    :integer
#

class Post < ActiveRecord::Base
  ################################### Attributes #################################
  attr_accessible :name, :content, :comment

  ################################### Validations ################################
  validates_presence_of :name
  validates_presence_of :content
  validates_presence_of :forum_id
  validates_presence_of :user_id

  ################################### Associations ###############################
  has_many :comments, :dependent=>:destroy
  belongs_to :forum
  belongs_to :user

  ################################### Scopes #####################################
  scope :latest, order('updated_at DESC')

  def timestamp
    updated_at.present? ? updated_at.tv_sec*1000 : ""
  end

  def name
    user.name
  end

  def as_json(options)
    #TODO sid instead of id
    attributes.slice("id", "content", "comment").merge({
      "name"=>name,
      "forum_sid"=>forum.sid, "timestamp"=>timestamp, 
      "comments"=>comments.order("updated_at").all})
  end
end
