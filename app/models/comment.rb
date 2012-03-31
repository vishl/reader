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
# Table name: comments
#
#  id         :integer         not null, primary key
#  name       :string(255)
#  content    :text
#  post_id    :integer
#  created_at :datetime
#  updated_at :datetime
#  user_id    :integer
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
    attributes.slice('id', 'content', 'post_id').merge(
      {'name'=>name, 'timestamp'=>timestamp, 'owner_id'=>user.sid})
  end

end
