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

class CommentsController < ApplicationController
  before_filter :authenticate

  def create
    has_error=false
    message = ""
    @forum = Forum.find_by_sid(params[:forum_id])
    if(!@forum)
      logger.error("Comment posting error: can't find forum with id #{params[:forum_id]}")
      render :json=>{"post"=>"invalid ID"}, :status=>400
    else
      @post = @forum.posts.find_by_id(params[:post_id])
      if(!@post)
        logger.error("Comment posting error: can't find post with id #{params[:post_id]}")
        render :json=>{"post"=>"invalid ID"}, :status=>400
      else
        if(!@forum.permission(current_user,:comment))
          render :json=>{"authorization"=>"Permission denied"}, :status=>401
        else
          @comment = @post.comments.build(params.slice(:content))
          @comment.user_id = current_user.id
          if(!@comment.save)
            logger.error("Comment posting error: #{@comment.errors}")
            render :json=>@comment.errors, :status=>400
          else
            #success
            render :json=>{'comment'=>@comment}
          end
        end
      end
    end
  end

end
