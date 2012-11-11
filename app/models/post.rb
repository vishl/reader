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
#  updatetime :datetime
#  meta       :text
#

class Post < ActiveRecord::Base
  ################################### Attributes #################################
  attr_accessible :name, :content, :comment, :meta

  ################################### Validations ################################
  before_validation {self.updatetime = Time.now}
  validates_presence_of :name
  validates_presence_of :content
  validates_presence_of :forum_id
  validates_presence_of :user_id
  validates_presence_of :updatetime

  ################################### Associations ###############################
  has_many :comments, :dependent=>:destroy
  belongs_to :forum
  belongs_to :user

  ################################### Scopes #####################################
  scope :latest, order('updated_at DESC')

  def timestamp
    created_at.present? ? created_at.tv_sec*1000 : ""
  end
  def updatetimestamp
    updatetime.present? ? updatetime.tv_sec*1000 : ""
  end

  def name
    user.name
  end

  def reset_markers(except=nil)
    Marker.where(:post_id=>self.id).find_each{|m| 
      if(!except || m.user_id!=except.id)
        m.update_attributes(:is_read=>false)
      end
    }
  end

  def touch
    self.update_attribute(:updatetime, Time.now)
  end

  def as_json(options={})
    options||={}
    #TODO sid instead of id
    ret = attributes.slice("id", "content", "comment", "meta").merge({
      "name"=>name,
      "forum_sid"=>forum.sid, "timestamp"=>timestamp, "updatetime"=>updatetimestamp,
      "comments"=>comments.order("updated_at").all,
      "owner_id"=>user.sid
    })

    if(options[:current_user])
      m = Marker.find_by_user_id_and_post_id(options[:current_user].id, self.id)
      if(m)
        ret = ret.merge(m.attributes.slice("is_starred", "is_read", "is_hidden"))
      end
    end
    return ret
  end
end

