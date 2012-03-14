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
# Table name: forums
#
#  id         :integer         not null, primary key
#  title      :string(255)
#  sid        :string(255)
#  created_at :datetime
#  updated_at :datetime
#

class Forum < ActiveRecord::Base
  include SessionsHelper
  attr_accessible :title

  ################################### Associations ###############################
  has_many :posts
  has_many :comments, :through=>:posts
  has_many :subscriptions
  has_many :users, :through=>:subscriptions

  ################################### Validations ################################
  before_validation {self.sid ||= gen_token}

  validates :title, :presence=>true
  validates :sid, :presence=>true, :uniqueness=>true

  def permission(user, thing)
    #right now, anyone can view
    if(thing==:view)
      return true
    end

    if(user.nil?)
      return false
    end
    sub = Subscription.find_by_user_id_and_forum_id(user.id, self.id)
    if(sub.nil?)
      return false
    end
    #anyone with a subscription can post
    return true
  end

  def as_json(options)
    options||={}
    #TODO include subscribers
    #TODO prefetch
    ret = {:title=>title, :id=>sid}
    if(options[:current_user])
      sub = Subscription.find_by_user_id_and_forum_id(options[:current_user].id, id)
      ret[:subscription] =sub 
    end
    return ret
    
  end


end
