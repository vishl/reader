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

class SubscriptionsController < ApplicationController
  before_filter :authenticate

  def create
    user = current_user
    forum = Forum.find_by_sid(params[:forum_id])
    if(forum.nil?)
      render :json=>{"forum"=>["is invalid"]}, :status=>400
    else
      sub = Subscription.new
      sub.forum_id = forum.id
      sub.user_id = user.id
      if(sub.save)
        render :json=>{"subscribed"=>true, "id"=>forum.sid}
      else
        render :json=>sub.errors, :status=>400
      end
    end
  end

  def destroy
    user = current_user
    forum = Forum.find_by_sid(params[:id])
    if(forum.nil?)
      render :json=>{"forum"=>["is invalid"]}, :status=>400
    else
      sub = Subscription.find_by_user_id_and_forum_id(user.id, forum.id)
      if(sub.nil?)
        render :json=>{"forum"=>["not subscribed"]}, :status=>400
      else
        sub.destroy
        render :json=>{"subscribed"=>false, "id"=>nil}
      end
    end
  end
end
