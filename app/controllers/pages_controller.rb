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

class PagesController < ApplicationController
  def home
    @forum = Forum.new
  end

  def bookmarklet
    @sid = params[:sid]
    render 'bookmarklet', :layout=>false, :content_type=>"text/javascript"
  end

  def backbone
  end

  def bbcv
    @content = params[:content]
    render :layout=>false
  end

  def postframe
    render :layout=>false
  end

  def test
    if(GlobalSettings.deployment=="live")
      redirect_to root_path
    else
      @user = User.find_by_email("vparikh1@gmail.com")
      @forums={}
      fs = @user.forums
      fs.each do |f|
        @forums[f] = f.posts.limit(2) if (f.posts.count>0)
      end
      if(params[:signup])
        render 'notifier/signup', :layout=>false
      else
        render 'notifier/updates', :layout=>false
      end
      if(params[:deliver])
        if(params[:signup])
          Notifier.signup(@user).deliver
        else
          Notifier.updates(@user, @forums).deliver
        end
      end
    end
  end
end
