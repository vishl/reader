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

class PostsController < ApplicationController
  before_filter :authenticate, :only=>[:create]

  def create
    @forum = Forum.find_by_sid(params[:forum_id])
    if(!@forum)
      render :json=>{"forum"=>"is invalid"}, :status=>400
    else
      if(!@forum.permission(current_user,:post))
        render :json=>{"authorization"=>"Permission denied"}, :status=>401
      else
        postparams = params[:post] || params.slice('content', 'comment')
        @post = @forum.posts.build(postparams)
        @post.user_id = current_user.id
        if(!@post.save)
          logger.error("Something went wrong: #{@post.errors}")
          render :json=>@post.errors, :status=>400
        else
          #no errors
          render :json=>{'post'=>@post}
        end
      end
    end
  end

  def show
    has_error=false
    message = ""
    @forum = Forum.find_by_sid(params[:forum_id])
    if(@forum)
      @post = @forum.posts.find_by_id(params[:id])
      if(@post)
        has_error=false;
      else
        has_error=true
        message="Invalid post";
      end
    else
      has_error=true;
      message="Invalid forum";
    end

    respond_to do |format|
      format.json {
        if(has_error)
          #TODO http error code
          render :json=>{'has_error'=>true, 'message'=>message}
        else
          render :json=>@post
        end
      }
    end
  end
          

end
