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
  has_one :owner, :class_name => 'Subscription', :conditions => {:status => 'owner'}

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

  def make_markers_for(post)
    if(post.forum.id != id)
      throw "invalid post"
    end

    self.users.each do |u|
      m = Marker.new(:user_id=>u.id, :post_id=>post.id, :forum_id=>self.id, :is_read=>false, :is_starred=>false, :is_hidden=>false)
      if(u.id==post.user_id) #this is the owner
        m.is_read=true
      end
      #TODO more graceful error handling
      m.save!
    end
  end

  def mark_all_read(user)
    Marker.where(:forum_id=>id, :user_id=>user.id).find_each{|m|m.update_attributes(:is_read=>true)}
  end

  def as_json(options)
    options||={}
    #TODO include subscribers
    #TODO prefetch
    ret = {:title=>title, :id=>sid, :owner=>owner ? owner.user.sid : nil}
    if(options[:current_user])
      sub = Subscription.find_by_user_id_and_forum_id(options[:current_user].id, id)
      ret[:subscription] =sub 
      ret[:unread_count] = Marker.where(:forum_id=>id, :user_id=>options[:current_user].id, :is_read=>false).count
    end
    if(options[:include_posts])
      offset = options[:offset] || 0
      limit = options[:limit] || 20
      if(options[:current_user])
        #get unread posts
        if(options[:hide_read])
          m = Marker.where(:forum_id=>self.id, :user_id=>options[:current_user].id, :is_read=>false).order("created_at DESC").offset(offset).limit(limit).all
        else
          m = Marker.where(:forum_id=>self.id, :user_id=>options[:current_user].id).order("created_at DESC").offset(offset).limit(limit).all
#        if(m.length<limit && !options[:hide_read])
#          m+=Marker.where(:forum_id=>self.id, :user_id=>options[:current_user].id, :is_read=>true).offset([offset-m.length, 0].max).limit(limit-m.length).all
        end
        ret[:posts] = Post.where("id IN (?)", m.map{|k|k.post_id}).includes(:comments).as_json(options)
      else
        ret[:posts] = self.posts.order("updated_at DESC").offset(offset).limit(limit).includes(:comments).as_json(options)
      end
    end
    return ret
    
  end


end
