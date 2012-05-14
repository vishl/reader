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
# Table name: subscriptions
#
#  id         :integer         not null, primary key
#  user_id    :integer
#  forum_id   :integer
#  created_at :datetime
#  updated_at :datetime
#  status     :string(255)
#

class Subscription < ActiveRecord::Base
  attr_accessible :forum_id
  ################################### Associations ###############################
  belongs_to :forum
  belongs_to :user

  ################################### Validations ################################
  validates_uniqueness_of :user_id, :scope => :forum_id, :message=>"is already subscribed"
  validates_presence_of :user_id, :forum_id
  validates :status, :format => {:with=>/^(owner)?$/}

  def subscribed?()
    return true;
  end

  def as_json(options)
    return {:user_id=>user.sid, :forum_id=>forum.sid, :forum_title=>forum.title, :subscribed=>true, :id=>forum.sid}
  end
end
